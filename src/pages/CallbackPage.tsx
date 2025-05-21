import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.error) {
      console.error('OIDC callback error:', auth.error);
      navigate('/error');
    } else if (auth.isAuthenticated) {
      navigate('/profile');
    }
  }, [auth.isLoading, auth.error, auth.isAuthenticated, navigate]);

  return (
    <motion.div
      className="flex h-screen items-center justify-center bg-background text-foreground"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative mx-auto mb-6 h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
        <p className="text-lg font-medium">Signing you in securely...</p>
      </motion.div>
    </motion.div>
  );
};

export default CallbackPage;
