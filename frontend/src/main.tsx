import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingApp from './LandingApp.tsx'
import './index.css'

import { paths } from './routes/paths.ts'
import LandingPage from "./pages/landing";
import HowItWorksStep from "./pages/guide";
import LoginPage from "./pages/login.tsx";
import SignupPage from "./pages/signup.tsx";
import FrequentlyAskedQuestions from './pages/faq.tsx'

import DashboardApp from './DashboardApp.tsx'
import Dashboard_Admin from './pages/dashboard/DashboardAdmin.tsx'
import Dashboard_Individual from "./pages/dashboard/DashboardIndividual.tsx";
import Dashboard_Business from "./pages/dashboard/DashboardBusiness.tsx";

// Admin
import AdminDeclarations from './pages/dashboard/admin/AdminDeclarations.tsx'
import AdminInvoices from './pages/dashboard/admin/AdminInvoices.tsx'
import AdminUsers from './pages/dashboard/admin/AdminUsers.tsx'
import AdminDocuments from './pages/dashboard/admin/AdminDocuments.tsx'
import AdminReports from './pages/dashboard/admin/AdminReports.tsx'
import AdminAuditLog from './pages/dashboard/admin/AdminAuditLog.tsx'

// Individual
import IndividualDeclarations from './pages/dashboard/individual/IndividualDeclarations.tsx'
import IndividualTracking from './pages/dashboard/individual/IndividualTracking.tsx'
import IndividualPayments from './pages/dashboard/individual/IndividualPayments.tsx'
import IndividualDocuments from './pages/dashboard/individual/IndividualDocuments.tsx'
import IndividualSettings from './pages/dashboard/individual/IndividualSettings.tsx'

// Business
import BusinessDeclarations from './pages/dashboard/business/BusinessDeclarations.tsx'
import BusinessPayments from './pages/dashboard/business/BusinessPayments.tsx'
import BusinessDocuments from './pages/dashboard/business/BusinessDocuments.tsx'
import BusinessImportsHistory from './pages/dashboard/business/BusinessImportsHistory.tsx'
import BusinessSettings from './pages/dashboard/business/BusinessSettings.tsx'

import AuthGuard from './auth/auth.guard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route element={<LandingApp />}>
          <Route path={paths.LandingPage} element={<LandingPage />} />
          <Route path={paths.HowItWorksSteps} element={<HowItWorksStep />} />
          <Route path={paths.FrequentlyAskedQuestions} element={<FrequentlyAskedQuestions />} />
          <Route path={paths.LoginPage} element={<LoginPage />} />
          <Route path={paths.SignupPage} element={<SignupPage />} />
          <Route path='*' element={<LandingPage />} />
        </Route>

        <Route element={<DashboardApp />}>
          {/* admin */}
          <Route path={paths.Dashboard_Admin} element={<AuthGuard allowedRoles={['admin']}><Dashboard_Admin /></AuthGuard>} />
          <Route path={paths.Admin_Declarations} element={<AuthGuard allowedRoles={['admin']}><AdminDeclarations /></AuthGuard>} />
          <Route path={paths.Admin_Invoices} element={<AuthGuard allowedRoles={['admin']}><AdminInvoices /></AuthGuard>} />
          <Route path={paths.Admin_Users} element={<AuthGuard allowedRoles={['admin']}><AdminUsers /></AuthGuard>} />
          <Route path={paths.Admin_Documents} element={<AuthGuard allowedRoles={['admin']}><AdminDocuments /></AuthGuard>} />
          <Route path={paths.Admin_Reports} element={<AuthGuard allowedRoles={['admin']}><AdminReports /></AuthGuard>} />
          <Route path={paths.Admin_AuditLog} element={<AuthGuard allowedRoles={['admin']}><AdminAuditLog /></AuthGuard>} />

          {/* pers-fizica */}
          <Route path={paths.Dashboard_Individual} element={<AuthGuard allowedRoles={['individual']}><Dashboard_Individual /></AuthGuard>} />
          <Route path={paths.Individual_Declarations} element={<AuthGuard allowedRoles={['individual']}><IndividualDeclarations /></AuthGuard>} />
          <Route path={paths.Individual_Tracking} element={<AuthGuard allowedRoles={['individual']}><IndividualTracking /></AuthGuard>} />
          <Route path={paths.Individual_Payments} element={<AuthGuard allowedRoles={['individual']}><IndividualPayments /></AuthGuard>} />
          <Route path={paths.Individual_Documents} element={<AuthGuard allowedRoles={['individual']}><IndividualDocuments /></AuthGuard>} />
          <Route path={paths.Individual_Settings} element={<AuthGuard allowedRoles={['individual']}><IndividualSettings /></AuthGuard>} />

          {/* pers-juridica */}
          <Route path={paths.Dashboard_Business} element={<AuthGuard allowedRoles={['business']}><Dashboard_Business /></AuthGuard>} />
          <Route path={paths.Business_Declarations} element={<AuthGuard allowedRoles={['business']}><BusinessDeclarations /></AuthGuard>} />
          <Route path={paths.Business_Payments} element={<AuthGuard allowedRoles={['business']}><BusinessPayments /></AuthGuard>} />
          <Route path={paths.Business_Documents} element={<AuthGuard allowedRoles={['business']}><BusinessDocuments /></AuthGuard>} />
          <Route path={paths.Business_Imports} element={<AuthGuard allowedRoles={['business']}><BusinessImportsHistory /></AuthGuard>} />
          <Route path={paths.Business_Settings} element={<AuthGuard allowedRoles={['business']}><BusinessSettings /></AuthGuard>} />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
