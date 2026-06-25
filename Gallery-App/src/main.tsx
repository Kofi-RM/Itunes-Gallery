import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { BookmarksProvider } from './bookmark/BookmarkProvider'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    
    <AuthProvider>
<BookmarksProvider>
<App/>
    </BookmarksProvider>
    </AuthProvider>
    
    </BrowserRouter>
  
  </StrictMode>,
)
