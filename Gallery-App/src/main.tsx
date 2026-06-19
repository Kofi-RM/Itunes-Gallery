import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GalleryDisplay from './nav/GalleryDisplay'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <GalleryDisplay/>
  </StrictMode>,
)
