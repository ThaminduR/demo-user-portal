import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { CircularProgress, Box } from '@mui/material';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
