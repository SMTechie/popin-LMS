import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthContext';
import { BrandingProvider } from './settings/BrandingContext';

const Boards = lazy(() => import('./pages/Boards'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Store = lazy(() => import('./pages/Store'));
const ParentPortal = lazy(() => import('./pages/ParentPortal'));
const TeacherPortal = lazy(() => import('./pages/TeacherPortal'));
const Settings = lazy(() => import('./pages/Settings'));
const Admissions = lazy(() => import('./pages/Admissions'));
const ApplicationFormBuilder = lazy(() => import('./pages/ApplicationFormBuilder'));
const ApplicationsPublic = lazy(() => import('./pages/ApplicationsPublic'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Requisitions = lazy(() => import('./pages/Requisitions'));
const RequisitionDetail = lazy(() => import('./pages/RequisitionDetail'));
const RequisitionCreate = lazy(() => import('./pages/RequisitionCreate'));
const SupplyChain = lazy(() => import('./pages/SupplyChain'));
const Students = lazy(() => import('./pages/Students'));
const IdentityIntegrations = lazy(() => import('./pages/IdentityIntegrations'));
const Hostel = lazy(() => import('./pages/Hostel'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrandingProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/applications/new" element={<ApplicationsPublic />} />
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Home />} />
                <Route path="/boards" element={<Boards />} />
                <Route path="/requisitions" element={<Requisitions />} />
                <Route path="/requisitions/new" element={<RequisitionCreate />} />
                <Route path="/requisitions/:id" element={<RequisitionDetail />} />
                <Route path="/supply-chain" element={<SupplyChain />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/store" element={<Store />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/admissions" element={<Admissions />} />
                <Route path="/students" element={<Students />} />
                <Route path="/hostel" element={<Hostel />} />
                <Route path="/admissions/form-builder" element={<ApplicationFormBuilder />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/parent-portal" element={<ParentPortal />} />
                <Route path="/teacher-portal" element={<TeacherPortal />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/identity-integrations" element={<IdentityIntegrations />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </Router>
      </BrandingProvider>
    </AuthProvider>
  );
};

export default App;
