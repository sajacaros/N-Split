import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SessionListPage from './pages/SessionListPage';
import SessionCreatePage from './pages/SessionCreatePage';
import SessionDetailPage from './pages/SessionDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<LoginPage />} />
          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <SessionListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/new"
            element={
              <ProtectedRoute>
                <SessionCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/:id"
            element={
              <ProtectedRoute>
                <SessionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/sessions" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
