
import { useAuth } from "../auth/useAuth";
import { useState } from "react";
import api from "../api/api";



const Profile = () => {
  const [file, setFile] = useState<File | null>(null);
const user = useAuth().user
console.log(user)
  const uploadImage = async () => {
    const formData = new FormData();

    if (!file) return
    formData.append("image", file);
    const userId = user ? user._id : 0
    const res = await api.post(
      `api/upload/upload-profile/${userId}`,
      formData
    );
    
    console.log("Updated user:", res.data);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          
          if (e.target.files)setFile(e.target.files[0])
        }
            }
      />
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
};

export default Profile;