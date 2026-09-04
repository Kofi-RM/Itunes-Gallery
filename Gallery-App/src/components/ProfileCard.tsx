import { useAuth } from "../auth/useAuth"
import { useNavigate } from "react-router-dom"


const ProfileCard = () => {

    const {user} = useAuth()
    const navigate = useNavigate()
   const src =  user && user.profileImageUrl ? user.profileImageUrl : "profileIcon.jpg"
   
//    console.log(user)
//    console.log(user?.profileImageUrl)
//    console.log(src)

    return (
 <button onClick={() => navigate("/profile")} aria-label="Open profile and bookmarks"
   className="min-w-11 min-h-11 rounded-full overflow-hidden">
   <img className="w-11 h-11 object-cover" src={src} alt="" />
 </button>
    )
}

export default ProfileCard
