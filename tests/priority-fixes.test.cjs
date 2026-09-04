// Run from the repository root: node --test tests/priority-fixes.test.cjs
// Isolated route and hook tests: no database, credentials, or network required.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../Gallery-App/node_modules/typescript');
const root = path.resolve(__dirname, '..');

function load(file, mocks, globals = {}) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/\.tsx?$/.test(file)) source = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, console, AbortController, URLSearchParams,
    process: { env: { FRONTEND_DEPLOYMENT: 'https://gallery.example' } },
    setTimeout, clearTimeout,
    require: (name) => {
      if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`);
      const value = mocks[name];
      return value && 'default' in value ? { __esModule: true, ...value } : value;
    }, ...globals,
  }, { filename: file });
  return module.exports;
}

function routes(file, mocks) {
  const handlers = {};
  const router = Object.fromEntries(['get', 'post', 'delete'].map((method) => [method,
    (url, ...callbacks) => { handlers[`${method} ${url}`] = callbacks.at(-1); }]));
  load(file, { express: { Router: () => router }, ...mocks });
  return handlers;
}
function response() {
  return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const flush = () => new Promise((resolve) => setImmediate(resolve));

// Minimal deterministic hook runner for testing asynchronous component logic.
// This is not a browser rendering/accessibility test.
function hooks() {
  const cells = [];
  let cursor = 0, effects = [];
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!cells[i]) cells[i] = { value: typeof initial === 'function' ? initial() : initial };
      return [cells[i].value, (next) => { cells[i].value = typeof next === 'function' ? next(cells[i].value) : next; }];
    },
    useRef(value) {
      const i = cursor++;
      if (!cells[i]) cells[i] = { current: value };
      return cells[i];
    },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!cells[i] || deps.some((value, j) => !Object.is(value, cells[i].deps[j]))) {
        effects.push(() => {
          cells[i]?.cleanup?.();
          cells[i] = { deps, cleanup: effect() };
        });
      }
    },
  };
  const jsx = (type, props, key) => ({ type, props, key });
  return {
    mocks: { react, 'react/jsx-runtime': { jsx, jsxs: jsx } },
    render(component, props) {
      cursor = 0; effects = [];
      const result = component(props);
      effects.forEach((effect) => effect());
      return result;
    },
    unmount() { cells.forEach((cell) => cell.cleanup?.()); },
  };
}
function find(node, type) {
  if (!node || typeof node !== 'object') return;
  if (node.type === type) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const match = find(child, type);
    if (match) return match;
  }
}

test('deleting a bookmark scopes the operation to the authenticated owner', async () => {
  let filter;
  const handler = routes('backend/routes/bookmarks.js', {
    '../models/Bookmark': { findOneAndDelete: async (query) => { filter = query; return null; } },
    '../util/auth': { authMiddleware() {} },
  })['delete /:trackId'];
  const res = response();
  await handler({ params: { trackId: '42' }, user: { _id: 'account-B' } }, res);
  assert.equal(filter.trackId, 42);
  assert.equal(filter.user, 'account-B');
  assert.equal(res.code, 404);
});

test('search forwards its limit and returns a recoverable upstream error', async () => {
  let options;
  const handler = routes('backend/routes/search.js', {
    axios: { get: async (_, config) => { options = config; throw new Error('offline'); } },
  })['get /'];
  const res = response();
  await handler({ query: { term: ' jazz ', media: 'music', limit: '36' } }, res);
  assert.equal(options.params.limit, 36);
  assert.equal(options.params.term, 'jazz');
  assert.equal(options.timeout, 10000);
  assert.equal(res.code, 502);
  const invalid = response();
  await handler({ query: { term: '', media: 'music' } }, invalid);
  assert.equal(invalid.code, 400);
});

test('search does not refetch on rerender and ignores superseded responses', async () => {
  const runner = hooks();
  const requests = [];
  const results = [];
  let debounced = '';
  const Component = load('Gallery-App/src/components/SearchBar.tsx', {
    ...runner.mocks,
    '../hooks/useDebounce': { default: () => ({ debounceValue: debounced }) },
    '../api/api': { default: { get: (_, config) => {
      const request = deferred(); requests.push({ ...request, config }); return request.promise;
    } } },
  }).default;
  const props = { setResults: (value) => results.push(value) };
  let tree = runner.render(Component, props);
  assert.equal(requests.length, 1);
  runner.render(Component, props);
  assert.equal(requests.length, 1);
  find(tree, 'input').props.onChange({ target: { value: 'jazz' } });
  runner.render(Component, props);
  assert.equal(requests[0].config.signal.aborted, true);
  debounced = 'jazz';
  tree = runner.render(Component, props);
  assert.equal(requests.length, 2);
  requests[1].resolve({ data: { results: ['jazz'] } });
  await flush();
  requests[0].resolve({ data: { results: ['Pop'] } });
  await flush();
  assert.deepEqual(results, [['jazz']]);
  runner.render(Component, props);
  assert.equal(requests.length, 2);
  find(tree, 'input').props.onChange({ target: { value: '' } });
  debounced = '';
  runner.render(Component, props);
  assert.equal(requests[2].config.params.term, 'Pop');
  runner.unmount();
});

test('logout changes bookmark session and aborted loads cannot repopulate it', async () => {
  const runner = hooks();
  const request = deferred();
  let config;
  let auth = { token: 'account-A', loggedIn: true };
  const Provider = load('Gallery-App/src/bookmark/BookmarkProvider.tsx', {
    ...runner.mocks,
    '../auth/useAuth': { useAuth: () => auth },
    './BookmarkContext': { BookmarksContext: { Provider: 'provider' } },
    '../api/api': { default: { get: (_, options) => { config = options; return request.promise; } } },
  }).BookmarksProvider;
  const session = Provider({ children: null });
  assert.equal(session.key, 'account-A');
  runner.render(session.type, session.props);
  runner.unmount();
  assert.equal(config.signal.aborted, true);
  request.resolve({ data: [{ trackId: 42 }] });
  await flush();
  const oldTree = runner.render(session.type, session.props);
  assert.equal(oldTree.props.value.bookmarks.length, 0);
  auth = { token: null, loggedIn: false };
  assert.equal(Provider({ children: null }).key, 'guest');
  auth = { token: 'account-B', loggedIn: true };
  assert.equal(Provider({ children: null }).key, 'account-B');
});

test('an add completing after logout cannot restore in-memory bookmarks', async () => {
  const runner = hooks();
  const mutation = deferred();
  let mutationConfig;
  const Provider = load('Gallery-App/src/bookmark/BookmarkProvider.tsx', {
    ...runner.mocks,
    '../auth/useAuth': { useAuth: () => ({ token: 'account-A', loggedIn: true }) },
    './BookmarkContext': { BookmarksContext: { Provider: 'provider' } },
    '../api/api': { default: {
      get: async () => ({ data: [] }),
      post: (_, __, config) => { mutationConfig = config; return mutation.promise; },
    } },
  }).BookmarksProvider;
  const session = Provider({ children: null });
  runner.render(session.type, session.props);
  await flush();
  const tree = runner.render(session.type, session.props);
  const operation = tree.props.value.toggleBookmark({ trackId: 42 });
  runner.unmount();
  assert.equal(mutationConfig.signal.aborted, true);
  mutation.resolve({});
  await operation;
  assert.equal(runner.render(session.type, session.props).props.value.bookmarks.length, 0);
});

test('malformed and expired login tokens are rejected without crashing', () => {
  const check = load('Gallery-App/src/auth/tokenCheck.ts', {
    'jwt-decode': { jwtDecode: (value) => {
      if (value === 'bad') throw new Error('malformed');
      return { exp: value === 'valid' ? Date.now() / 1000 + 3600 : 0 };
    } },
  }).default;
  assert.equal(check('bad'), true);
  assert.equal(check('expired'), true);
  assert.equal(check('valid'), false);
});

test('OAuth validates the token, removes it from the URL, and navigates home', async () => {
  const runner = hooks();
  const calls = [];
  const Component = load('Gallery-App/src/nav/OAuthSuccess.tsx', {
    ...runner.mocks,
    'react-router-dom': { Link: 'a', useNavigate: () => (url) => calls.push(['navigate', url]) },
    '../auth/useAuth': { useAuth: () => ({ login: (token) => calls.push(['login', token]) }) },
    '../auth/tokenCheck': { default: () => false },
    '../api/api': { default: { get: async (_, config) => { calls.push(['verify', config.headers.Authorization]); return {}; } } },
  }, {
    window: { location: { hash: '#token=valid-token', search: '', pathname: '/oauth-success' },
      history: { state: {}, replaceState: (_, __, url) => calls.push(['clean', url]) } },
  }).default;
  runner.render(Component, {});
  await flush();
  assert.deepEqual(calls, [['clean', '/oauth-success'], ['verify', 'Bearer valid-token'], ['login', 'valid-token'], ['navigate', '/']]);
  runner.unmount();
});

test('OAuth without a token renders an error instead of attempting login', () => {
  const runner = hooks();
  const Component = load('Gallery-App/src/nav/OAuthSuccess.tsx', {
    ...runner.mocks,
    'react-router-dom': { Link: 'a', useNavigate: () => () => assert.fail('unexpected navigation') },
    '../auth/useAuth': { useAuth: () => ({ login: () => assert.fail('unexpected login') }) },
    '../auth/tokenCheck': { default: () => true },
    '../api/api': { default: { get: () => assert.fail('unexpected request') } },
  }, {
    window: { location: { hash: '', search: '', pathname: '/oauth-success' },
      history: { state: {}, replaceState() {} } },
  }).default;
  const tree = runner.render(Component, {});
  assert.equal(find(tree, 'p').props.role, 'alert');
});

function userRoutes(model) {
  return routes('backend/routes/user.js', {
    '../models/User': model,
    '../util/auth': { authMiddleware() {}, signToken: () => 'signed-token' },
    '../util/passport': { authenticate: () => () => {} },
    '../util/upload': { single: () => () => {} },
    dotenv: { config() {} },
  });
}

test('avatar upload updates only the authenticated account and handles missing files', async () => {
  let id, fields, projection;
  const handler = userRoutes({ findByIdAndUpdate: (userId, update) => {
    id = userId; fields = update;
    return { select: async (value) => { projection = value; return { _id: userId }; } };
  } })['post /me/avatar'];
  const res = response();
  await handler({ user: { _id: 'account-A' }, file: { path: 'image-url' } }, res);
  assert.equal(id, 'account-A');
  assert.equal(fields.profileImageUrl, 'image-url');
  assert.equal(projection.includes('password'), false);
  assert.equal(res.body._id, 'account-A');
  const missing = response();
  await handler({ user: { _id: 'account-A' } }, missing);
  assert.equal(missing.code, 400);
});

test('local registration never accepts a client-supplied GitHub identity', async () => {
  let created;
  const handler = userRoutes({ create: async (input) => { created = input; return input; } })['post /register'];
  const res = response();
  await handler({ body: { email: 'person@example.com', username: 'person', password: 'Example123!', githubId: 'another-user' } }, res);
  assert.equal(res.code, 201);
  assert.equal(created.githubId, undefined);
  assert.equal(created.password, 'Example123!');
});

test('GitHub accounts may omit passwords, but local accounts may not', async () => {
  const User = require('../backend/models/User');
  const github = new User({ username: 'github-user', githubId: 'test-provider-id' });
  await github.validate();
  assert.equal(await github.isCorrectPassword('anything'), false);
  const local = new User({ username: 'local-user', email: 'local@example.com' });
  await assert.rejects(local.validate(), (error) => !!error.errors.password);
});

test('cards expose visible, named preview and bookmark buttons without hover', () => {
  const runner = hooks();
  const Card = load('Gallery-App/src/components/Card.tsx', {
    ...runner.mocks,
    '../auth/useAuth': { useAuth: () => ({ loggedIn: true }) },
    '../bookmark/useBookmarks': { default: () => ({ toggleBookmark() {}, isBookmarked: () => true }) },
    '../assets/icons/BookmarkFilled': { default: 'saved-icon' },
    '../assets/icons/BookmarkOutline': { default: 'save-icon' },
  }).default;
  const tree = Card({ result: { trackId: 1, trackName: 'Test song', artistName: 'Artist', previewUrl: '/preview' }, onClick() {} });
  const buttons = tree.props.children.at(-1).props.children;
  assert.equal(buttons[0].props['aria-label'], 'Play preview of Test song');
  assert.equal(buttons[1].props['aria-label'], 'Unsave Test song');
  assert.equal(buttons[1].props['aria-pressed'], true);
  assert.equal(buttons.some((button) => button.props.className.includes('opacity-0')), false);
  assert.equal(find(tree, 'img').props.loading, 'lazy');
});

test('native scrubber has an accessible label, handles keyboard commits, and clamps invalid values', () => {
  const runner = hooks();
  const Slider = load('Gallery-App/src/components/MediaPlayer/Slider.tsx', runner.mocks).default;
  let committed;
  const tree = Slider({ value: NaN, duration: 30, onChange() {}, onCommit: (value) => { committed = value; } });
  assert.equal(tree.type, 'input');
  assert.equal(tree.props.type, 'range');
  assert.equal(tree.props.value, 0);
  assert.equal(tree.props['aria-label'], 'Playback position');
  tree.props.onKeyUp({ key: 'ArrowRight', currentTarget: { value: '0.5' } });
  assert.equal(committed, 0.5);
  assert.equal(Slider({ value: 0, duration: 0, onChange() {} }).props.disabled, true);
});

test('expanded player uses inline video, stays keyboard-dismissable, and restores scroll', () => {
  const runner = hooks();
  let expanded = true;
  const document = { body: { style: { overflow: 'auto' } } };
  const Player = load('Gallery-App/src/components/MediaPlayer/MediaPlayer.tsx', {
    ...runner.mocks,
    '../../util/helperFunctions': { default: { isVideo: () => true, formatTime: () => '0:00' } },
    './VolumeIcon': { default: 'volume-icon' },
    './Slider': { default: 'slider' },
  }, { document, navigator: { userAgent: 'iPhone', platform: 'iPhone', maxTouchPoints: 1 } }).default;
  const tree = runner.render(Player, {
    activeMedia: { trackName: 'Preview', artistName: 'Artist' }, isFullscreen: true,
    setIsFullscreen: (value) => { expanded = value; }, audioRef: { current: null }, videoRef: { current: null },
    volume: 0.5, currentTime: 0, duration: 30, progress: 0,
  });
  assert.equal(tree.props.role, 'dialog');
  assert.equal(tree.props['aria-modal'], true);
  assert.equal(find(tree, 'video').props.playsInline, true);
  assert.equal(document.body.style.overflow, 'hidden');
  tree.props.onKeyDown({ key: 'Escape', preventDefault() {} });
  assert.equal(expanded, false);
  runner.unmount();
  assert.equal(document.body.style.overflow, 'auto');
});
