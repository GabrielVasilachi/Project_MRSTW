import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { paths } from './routes/paths.ts'
import LandingPage from "./pages/landing";
import HowItWorksStep from "./pages/guide";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route element={<App />}>
          <Route path='*' element={<LandingPage />} />
          <Route path={paths.LandingPage} element={<LandingPage />} />
          <Route path={paths.HowItWorksSteps} element={<HowItWorksStep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
