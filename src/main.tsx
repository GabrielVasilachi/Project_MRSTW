import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingApp from './LandingApp.tsx'
import './index.css'

import { paths } from './routes/paths.ts'
import LandingPage from "./pages/landing";
import HowItWorksStep from "./pages/guide";

import DashboardApp from './DashboardApp.tsx'
import DashboardAdmin from './pages/dashboard/DashboardAdmin.tsx'
import Dashboard_Individual from "./pages/dashboard/DashboardIndividual.tsx";
import Dashboard_Business from "./pages/dashboard/DashboardBusiness.tsx";
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
          <Route/>
          <Route path={paths.Dashboard_Individual} element={<Dashboard_Individual />} />
          <Route path={paths.Dashboard_Business} element={<Dashboard_Business />} />
          <Route path={paths.DashboardSettings} element={<DashboardSettings />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
