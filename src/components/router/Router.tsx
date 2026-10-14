import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Fields } from '../fields/Fields';
import AdminPanel from '../adminPanel/AdminPanel';
import OrdersPage from '../orders/OrdersPage';
import type { ParcelStep } from '../orders/types';
import TrackingTimeline from '../tracking/TrackingTimeline';
import ProtectedRoute from './ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import PrivacyPolicy from '../privacypolicy/PrivacyPolicy';
import TermsOfService from '../termsOfService/TermsOfService';
import ComplaintsPolicy from '../complaintsPolicy/ComplaintsPolicy';
import DocumentsPage from '../documentsPage/DocumentsPage';
import UsersPage from '../usersPage/UsersPage';
import ReviewsPage from '../reviewsPage/ReviewsPage';
import Landing from '../landing/Landing';
import ChangePasswordPage from '../changePassword/ChangePasswordPage';

interface AppRoutesProps {
  steps: ParcelStep[];
  setSteps: React.Dispatch<React.SetStateAction<ParcelStep[]>>;
  setParcelNumber: React.Dispatch<React.SetStateAction<string>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ steps, setParcelNumber, setSteps }) => {
  const { isAuthenticated, isAdmin, isCompany, isLoading, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.mustChangePassword ? (
              <Navigate to="/change-password" replace />
            ) : (
              <Navigate
                to={isAdmin ? '/admin/accepted' : isCompany ? '/admin/new-order' : '/admin/documents'}
                replace
              />
            )
          ) : (
            <Navigate to="/ervi-group" replace />
          )
        }
      />
      <Route
        path="/tracking"
        element={
          <TrackingTimeline steps={steps} setParcelNumber={setParcelNumber} setSteps={setSteps} />
        }
      />
      <Route path="/ochrana-osobnych-udajov" element={<PrivacyPolicy />} />
      <Route path="/obchodne-podmienky" element={<TermsOfService />} />
      <Route path="/reklamacny-poriadok" element={<ComplaintsPolicy />} />
      <Route path="/ervi-group" element={<Landing />} />
      <Route
        path="/change-password"
        element={isAuthenticated ? <ChangePasswordPage /> : <Navigate to="/" replace />}
      />

      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            mustChangePassword={user?.mustChangePassword}
          />
        }
      >
        <Route path="/admin" element={<AdminPanel />}>
          {!isCompany && <Route path="documents" element={<DocumentsPage />} />}
          {(isAdmin || isCompany) && (
            <>
              <Route path="accepted" element={<OrdersPage type="accepted" />} />
              <Route path="sent" element={<OrdersPage type="sent" />} />
              <Route path="delivered" element={<OrdersPage type="delivered" />} />
              <Route path="paid" element={<OrdersPage type="paid" />} />
              <Route path="cancelled" element={<OrdersPage type="cancelled" />} />
            </>
          )}
          {isAdmin && (
            <>
              <Route path="home" element={<Fields />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
            </>
          )}
          {isCompany && <Route path="new-order" element={<Fields />} />}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
