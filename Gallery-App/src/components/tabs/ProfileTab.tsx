import { useState } from "react";
import api from "../../api/api";
import type { User } from "../../type/User";
const ProfileTab = ({ user }: { user: User | null}) => {
  const [file, setFile] = useState<File | null>(null);

  const uploadImage = async () => {
    if (!file) return;
    if(!user) return
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post(`api/upload/upload-profile/${user._id}`, formData);
    console.log("Updated user:", res.data);
  };

  return (
    <div className="max-w-md flex flex-col gap-5">
      <h1 className="text-xl font-medium text-white">Profile</h1>

      {/* avatar */}
      <div className="flex items-center gap-4">
        <img src={user?.profileImageUrl}className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center text-white font-medium text-lg"/>
        
        <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        <button onClick={uploadImage} className="text-sm text-zinc-400 hover:text-white">Upload</button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Username</label>
        <input defaultValue={user?.username} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Email</label>
        <input defaultValue={user?.email} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">New password</label>
        <input type="password" placeholder="••••••••" className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" />
      </div>

      <button className="bg-white text-black rounded-lg px-4 py-2 text-sm font-medium w-fit">
        Save changes
      </button>
    </div>
  );
};

export default ProfileTab;