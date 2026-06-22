'use client';

import React, { Suspense, lazy } from 'react';
import '@radix-ui/themes/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './views/Home';
import NotFound from './views/NotFound';
import Login from './views/Login';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/AuthContext';
import { BrandingProvider } from './settings/BrandingContext';

const Boards = lazy(() => import('./views/Boards'));
const Analytics = lazy(() => import('./views/Analytics'));
const Store = lazy(() => import('./views/Store'));
const ParentPortal = lazy(() => import('./views/ParentPortal'));
const TeacherPortal = lazy(() => import('./views/TeacherPortal'));
const Settings = lazy(() => import('./views/Settings'));
const Admissions = lazy(() => import('./views/Admissions'));
const ApplicationFormBuilder = lazy(() => import('./views/ApplicationFormBuilder'));
const ApplicationsPublic = lazy(() => import('./views/ApplicationsPublic'));
const Tickets = lazy(() => import('./views/Tickets'));
const Inventory = lazy(() => import('./views/Inventory'));
const Requisitions = lazy(() => import('./views/Requisitions'));
const RequisitionDetail = lazy(() => import('./views/RequisitionDetail'));
const RequisitionCreate = lazy(() => import('./views/RequisitionCreate'));
const SupplyChain = lazy(() => import('./views/SupplyChain'));
const Students = lazy(() => import('./views/Students'));
const IdentityIntegrations = lazy(() => import('./views/IdentityIntegrations'));
const Hostel = lazy(() => import('./views/Hostel'));

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
