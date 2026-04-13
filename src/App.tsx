import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import './App.css'
import Register from './Page/Register'
import Login from './Page/Login'
import Dashboard from './Page/Dashboard'
import MyItems from './Page/MyItems'
import Exchanges from './Page/Exchanges'
import AiChat from './Page/AiChat'
import Profile from './Page/Profile'
import ErrorPage from './Page/ErrorPage'
import { ThemeProvider } from './context/ThemeContext'

function ErrorPageWrapper() {
  const [params] = useSearchParams();
  const code = parseInt(params.get("code") ?? "404");
  return <ErrorPage code={code} />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/exchanges" element={<Exchanges />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/error" element={<ErrorPageWrapper />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App