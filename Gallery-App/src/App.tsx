
import {Routes, Route, Navigate} from "react-router-dom"

import './App.css'
import GalleryDisplay from './nav/GalleryDisplay'
import Register from "./nav/Register"
import Login from "./nav/Login"
import Profile from "./nav/Profile"
import OAuthSuccess from "./nav/OAuthSuccess"
import { useAuth } from "./auth/useAuth"
function App() {
  const { loggedIn } = useAuth();
  // OAuth returns through `/` so this also works on static hosts that do not
  // rewrite direct requests for `/oauth-success` to index.html.
  const completingOAuth = window.location.hash.startsWith("#token=");
  if (completingOAuth) return <OAuthSuccess />;

  return (
    <>
    <Routes>
      <Route path="/" element={<GalleryDisplay/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/oauth-success" element={<OAuthSuccess/>}/>
      <Route path="/dashboard" element={<Navigate to="/" replace/>}/>
      <Route path="/profile" element={loggedIn ? <Profile/> : <Navigate to="/login" replace/>}/>
    </Routes>
   </>
  )
}

export default App
