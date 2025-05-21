import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import Navbar from './components/NavBar';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
