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
 <img onClick = {() => navigate("/profile")} className="rounded w-14 h-14"src={src}/>
    )
}

export default ProfileCard