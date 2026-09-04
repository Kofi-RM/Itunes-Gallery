import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import ProfileTab from "../components/tabs/ProfileTab";
import SettingsTab from "../components/tabs/SettingsTab";
import BookmarksTab from "../components/tabs/BookmarksTab";

type Tab = "profile" | "settings" | "bookmarks";
const NAV = [
  { id: "profile", label: "Profile" },
  { id: "bookmarks", label: "Bookmarks" },
  { id: "settings", label: "Settings" },
] as const;

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { user } = useAuth();
  const navigate = useNavigate();
  return <div className="flex flex-col md:flex-row min-h-svh bg-zinc-950 text-white">
    <aside className="w-full md:w-48 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-3 shrink-0">
      <button onClick={() => navigate("/")} className="min-h-11 px-3 mb-2 text-sm">← Back to gallery</button>
      <nav aria-label="Account sections" className="flex flex-wrap md:flex-col gap-1">
        {NAV.map((item) => <button key={item.id} onClick={() => setActiveTab(item.id)}
          aria-current={activeTab === item.id ? "page" : undefined}
          className={`min-h-11 flex-1 md:flex-none px-3 py-2 rounded-lg text-sm text-left ${activeTab === item.id
            ? "bg-zinc-800 text-white font-medium" : "text-zinc-300 hover:bg-zinc-800"}`}>
          {item.label}
        </button>)}
      </nav>
    </aside>
    <main className="min-w-0 flex-1 p-4 sm:p-8 text-left">
      {activeTab === "profile" && <ProfileTab user={user} />}
      {activeTab === "settings" && <SettingsTab />}
      {activeTab === "bookmarks" && <BookmarksTab />}
    </main>
  </div>;
}
