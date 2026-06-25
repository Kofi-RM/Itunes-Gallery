const SettingsTab = () => {
  return (
    <div className="max-w-md flex flex-col gap-5">
      <h1 className="text-xl font-medium text-white">Settings</h1>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Theme</label>
        <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm">
          <option>System default</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Autoplay</label>
        <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm">
          <option>On</option>
          <option>Off</option>
        </select>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-zinc-800">
        <div>
          <p className="text-sm text-white">Email notifications</p>
          <p className="text-xs text-zinc-500">Get updates about your account</p>
        </div>
        <input type="checkbox" className="w-4 h-4 accent-white" />
      </div>

      <div className="flex items-center justify-between py-3 border-b border-zinc-800">
        <div>
          <p className="text-sm text-white">Autoplay videos</p>
          <p className="text-xs text-zinc-500">Automatically play videos in feed</p>
        </div>
        <input type="checkbox" defaultChecked className="w-4 h-4 accent-white" />
      </div>

      <div className="pt-2">
        <button className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium">
          Save changes
        </button>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Danger zone</p>
        <button className="text-red-400 hover:text-red-300 text-sm text-left w-fit">
          Delete account
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;