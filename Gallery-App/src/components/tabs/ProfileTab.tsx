import { useState } from "react";
import api from "../../api/api";
import type { User } from "../../type/User";
import { useAuth } from "../../auth/useAuth";

export default function ProfileTab({ user }: { user: User | null }) {
  const { setUser, token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const uploadImage = async () => {
    if (!file || !user || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post<User>("/api/users/me/avatar", formData);
      // Ignore a response belonging to a session that has since signed out.
      if (localStorage.getItem("gallery_token") !== token) return;
      setUser(data);
      setMessage("Profile picture updated.");
    } catch {
      setMessage("Upload failed. Please try a JPG or PNG image up to 5 MB.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="max-w-md flex flex-col gap-5">
    <h1 className="text-xl font-medium text-white">Profile</h1>
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <img src={user?.profileImageUrl || "/profileIcon.jpg"} alt="Profile"
        className="w-14 h-14 rounded-full bg-zinc-700" />
      <div className="min-w-0">
        <label htmlFor="avatar" className="block text-sm text-zinc-400">Profile picture</label>
        <input id="avatar" type="file" accept="image/jpeg,image/png" disabled={busy}
          className="max-w-full" onChange={(event) => {
            const selected = event.target.files?.[0] ?? null;
            if (selected && (selected.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(selected.type))) {
              setFile(null);
              setMessage("Choose a JPG or PNG image up to 5 MB.");
              return;
            }
            setFile(selected);
            setMessage("");
          }} />
      </div>
      <button onClick={uploadImage} disabled={!file || !user || busy}
        className="text-sm text-zinc-300 disabled:opacity-50">{busy ? "Uploading…" : "Upload"}</button>
    </div>
    <p role="status" className="text-sm text-zinc-300">{message}</p>
    <dl className="text-left text-white">
      <dt className="text-sm text-zinc-400">Username</dt><dd>{user?.username || "—"}</dd>
      <dt className="text-sm text-zinc-400 mt-4">Email</dt><dd>{user?.email || "Not provided"}</dd>
    </dl>
    <p className="text-sm text-zinc-400">Username, email, and password editing are not available yet. Only your profile picture can be updated here.</p>
  </div>;
}
