
import {Routes, Route} from "react-router-dom"

import './App.css'
import GalleryDisplay from './nav/GalleryDisplay'
import Register from "./nav/Register"

function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<GalleryDisplay/>}/>
      <Route path="/register" element={<Register/>}/>
      
    </Routes>
   </>
  )
}

export default App
