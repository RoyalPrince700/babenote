import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PlatformLayout from './layouts/PlatformLayout'
// Site not ready — only Miss Me is live for now
// import Landing from './pages/Landing'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Templates from './pages/Templates'
// import Customize from './pages/Customize'
// import Dashboard from './pages/Dashboard'
// import PublicView from './pages/PublicView'
import DoYouMissMe from './pages/DoYouMissMe'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PlatformLayout />}>
            {/* Landing page = I Miss You */}
            <Route index element={<DoYouMissMe />} />
            <Route path="do-you-miss-me" element={<DoYouMissMe />} />
            {/* <Route path="login" element={<Login />} /> */}
            {/* <Route path="register" element={<Register />} /> */}
            {/* <Route path="templates" element={<Templates />} /> */}
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
          </Route>
          {/* <Route path="customize/:slug" element={<Customize />} /> */}
          {/* <Route path="p/:shareId" element={<PublicView />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
