# Render backend settings

Configure the existing Render **Web Service** with:

- Root Directory: `backend`
- Build Command: `npm run render-build`
- Start Command: `npm start`
- Health Check Path: `/health`

Do not prepend another `npm install` or `npm ci` to the build command. The
`render-build` script performs one deterministic production-only install.

Environment variables are documented in `.env.example`. For production OAuth,
set `FRONTEND_URL` to the public frontend URL and `OAUTH_BACKEND_URL` to this
service's public HTTPS URL.
