import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import ProfileTab from "../components/tabs/ProfileTab";
import SettingsTab from "../components/tabs/SettingsTab";
import BookmarksTab from "../components/tabs/BookmarksTab";

type Tab = "profile" | "settings" | "bookmarks";

const NAV = [
  { id: "profile", label: "Profile", icon: "ti-user" },
  { id: "settings", label: "Settings", icon: "ti-settings" },
  { id: "bookmarks", label: "Bookmarks", icon: "ti-bookmark" },
] as const;

const Profile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { user } = useAuth();
const navigate = useNavigate()
  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* SIDEBAR */}
      <aside className="w-48 bg-zinc-900 border-r border-zinc-800 flex flex-col gap-1 p-4 flex-shrink-0">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
              activeTab === item.id
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <i className={`ti ${item.icon} text-lg`} />
            {item.label}
          </button>
        ))}
        <button onClick={() => navigate("/")}>Back</button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && <ProfileTab user={user} />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "bookmarks" && <BookmarksTab />}
      </main>
    </div>
  );
};

export default Profile;