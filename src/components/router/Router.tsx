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
import DocumentsPage from '../documentsPage/DocumentsPage';

interface AppRoutesProps {
  steps: ParcelStep[];
  setSteps: React.Dispatch<React.SetStateAction<ParcelStep[]>>;
  setParcelNumber: React.Dispatch<React.SetStateAction<string>>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ steps, setParcelNumber, setSteps }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/admin/accepted" replace /> : <Fields />}
      />
      <Route
        path="/tracking"
        element={
          <TrackingTimeline steps={steps} setParcelNumber={setParcelNumber} setSteps={setSteps} />
        }
      />
      <Route path="/ochrana-osobnych-udajov" element={<PrivacyPolicy />} />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/admin" element={<AdminPanel />}>
          <Route path="home" element={<Fields />} />
          <Route path="accepted" element={<OrdersPage type="accepted" />} />
          <Route path="sent" element={<OrdersPage type="sent" />} />
          <Route path="delivered" element={<OrdersPage type="delivered" />} />
          <Route path="paid" element={<OrdersPage type="paid" />} />
          <Route path="cancelled" element={<OrdersPage type="cancelled" />} />
          <Route path="documents" element={<DocumentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
