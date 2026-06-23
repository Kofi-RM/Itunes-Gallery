
import {Routes, Route} from "react-router-dom"

import './App.css'
import GalleryDisplay from './nav/GalleryDisplay'
import Register from "./nav/Register"
import Login from "./nav/Login"

function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<GalleryDisplay/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
   </>
  )
}

export default App
