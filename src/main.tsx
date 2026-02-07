import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing.tsx'
import AuthenticationPage from './pages/authentification.tsx'
import SignupPage from './pages/signup.tsx'
import CreateAccountPage from './pages/create-account.tsx'
import DashboardPage from './pages/dashboard.tsx'
import HowItWorksStep from './pages/guide.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/guide" element={<HowItWorksStep />} />
          <Route path="/authentification" element={<AuthenticationPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
