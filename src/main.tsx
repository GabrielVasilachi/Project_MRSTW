import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingApp from './LandingApp.tsx'
import './index.css'

import { paths } from './routes/paths.ts'
import LandingPage from "./pages/landing";
import HowItWorksStep from "./pages/guide";
import DashboardMain from "./pages/DashboardMain";

import DashboardApp from './DashboardApp.tsx'
import DashboardSettings from './pages/DashboardSettings.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route element={<LandingApp />}> {/* aceasta linie este pentru a aplica headerul si footerul doar pentru paginile de mai jos */}
          <Route path={paths.LandingPage} element={<LandingPage />} />
          <Route path={paths.HowItWorksSteps} element={<HowItWorksStep />} />
          <Route path='*' element={<LandingPage />} />
        </Route>

        <Route element={<DashboardApp />}> {/* aceasta linie este pentru a aplica sidebarul doar pentru paginile de mai jos */}
          <Route path={paths.DashboardMain} element={<DashboardMain />} />
          <Route path={paths.DashboardSettings} element={<DashboardSettings />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
