export default function SettingsTab() {
  return <div className="max-w-md flex flex-col gap-5">
    <h1 className="text-xl font-medium text-white">Settings</h1>
    <p className="text-sm text-zinc-400">
      Theme, autoplay preferences, and email notifications are not available yet.
      No settings changes can be saved on this page.
    </p>
    <div className="pt-4 border-t border-zinc-800">
      <h2 className="text-sm text-white">Account deletion</h2>
      <p className="text-sm text-zinc-400">Self-service account deletion is not available yet.</p>
    </div>
  </div>;
}
