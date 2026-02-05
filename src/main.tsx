import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AuthentificationPage from './pages/authentification'
import CreateAccountPage from './pages/create-account'
import LandingPage from './pages/landing'
import SignUpPage from './pages/signup'
import Dashboard from './pages/dashboard.tsx'

//functie pentru adaugare de route-s si de chemare a paginilor
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/authentification', element: <AuthentificationPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/create-account', element: <CreateAccountPage /> },
  { path: '/dashboard', element: <Dashboard /> },
])

// folosirea functiei create numita router pentru a chema paginile de mai sus
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
