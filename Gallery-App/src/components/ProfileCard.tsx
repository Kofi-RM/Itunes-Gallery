import { useAuth } from "../auth/useAuth"



const ProfileCard = () => {

    const {user} = useAuth()

   const src =  user && user.profileImageUrl ? user.profileImageUrl : "profileIcon.jpg"
   
   console.log(user)
   console.log(user?.profileImageUrl)
   console.log(src)

    return (
 <img className="rounded w-14 h-14"src={src}/>
    )
}

export default ProfileCard