import React, { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPasskey } from '../utils/fido2';

const RegisterPage = () => {
  const [flowId, setFlowId] = useState<string | null>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState('');
  const [passkeyPrompting, setPasskeyPrompting] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_IS_BASE_URL}/api/server/v1/registration/initiate`, {})
      .then((res) => {
        setFlowId(res.data.flowId);
        handleStep(res.data);
      })
      .catch(() => navigate('/error'));
  }, [navigate]);

  const handleStep = (data: any) => {
    if (data.flowStatus === 'COMPLETE') {
      navigate('/success');
      return;
    }

    switch (data.type) {
      case 'VIEW':
        setComponents(data.data.components || []);
        break;

      case 'PROVIDE':
        const providedInputs: Record<string, string> = {};
        (data.data.requiredParams || []).forEach((param: string) => {
          if (param === 'origin') {
            providedInputs[param] = window.location.origin;
          }
        });
        submit({ flowId: data.flowId, actionId: '', inputs: providedInputs });
        break;

      case 'INTERACT':
        setPasskeyPrompting(true);
        createPasskey(data.data.additionalData.interactionData)
          .then(({ requestId, credential }: { requestId: string; credential: PublicKeyCredential }) => {
            const fido2Response = JSON.stringify({ requestId, credential });
            submit({
              flowId: data.flowId,
              actionId: '',
              inputs: {
                fido2Response,
              },
            });
          })
          .catch((err: { name: string; }) => {
            console.error('Passkey creation failed:', err);
            if (err instanceof DOMException && err.name === 'InvalidStateError') {
              setPasskeyError(
                'This passkey is already registered with your account. You may try logging in instead.'
              );
            } else {
              navigate('/error');
            }
          });
        break;

      case 'REDIRECT':
        window.location.href = data.url;
        break;

      default:
        console.warn('Unhandled step type:', data.type);
        break;
    }
  };

  const submit = (payload: any) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_IS_BASE_URL}/api/server/v1/registration/submit`, payload)
      .then((res) => handleStep(res.data))
      .catch(() => navigate('/error'))
      .finally(() => setLoading(false));
  };

  const renderComponent = (component: any): JSX.Element | null => {
    const key = component.id;
    const config = component.config;

    switch (component.type) {
      case 'TYPOGRAPHY':
        return (
          <h2 key={key} className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {config.text}
          </h2>
        );

      case 'INPUT':
        return (
          <div key={key} className="mb-4">
            <label
              htmlFor={config.identifier}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {config.label}
            </label>
            <input
              id={config.identifier}
              name={config.identifier}
              type={config.type}
              required={config.required}
              placeholder={config.placeholder}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, [config.identifier]: e.target.value }))
              }
            />
          </div>
        );

      case 'BUTTON':
        return (
          <button
            key={key}
            type={config.type}
            onClick={() => setActionId(key)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded-lg transition"
          >
            {config.text}
          </button>
        );

      case 'FORM':
        return (
          <form
            key={key}
            onSubmit={(e) => {
              e.preventDefault();
              if (flowId) {
                submit({ flowId, actionId, inputs });
              }
            }}
            className="space-y-4"
          >
            {component.components.map(renderComponent)}
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      {passkeyPrompting ? (
        <div className="flex flex-col items-center justify-center text-center w-full h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full px-6 py-10 rounded-xl shadow-2xl bg-white dark:bg-gray-900"
          >
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-3xl">
                🔐
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Passkey Verification
              </h2>
              {passkeyError ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passkeyError}</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Please follow the browser or device prompt to register your passkey.
                  </p>
                  <div className="flex justify-center mt-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  </div>
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    This may take a few seconds...
                  </p>
                </>
              )}
            </div>
            {passkeyError && (
              <button
                onClick={() => navigate('/login')}
                className="mt-6 text-sm text-indigo-600 hover:underline"
              >
                Go to Login
              </button>
            )}
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <div className="text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
              <p className="text-sm">Processing...</p>
            </div>
          ) : (
            components.map(renderComponent)
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RegisterPage;
