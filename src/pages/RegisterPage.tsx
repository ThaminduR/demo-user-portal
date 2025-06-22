import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { handleCallbackIfPresent, initializeFlow, submitFlowStep } from '../utils/flowHandler';
import { ComponentRenderer } from '../components/ComponentRenderer';
import { createPasskey } from '../utils/fido2';

const SESSION_KEY = 'FEDERATED_SIGNUP_FLOW_ID';

const RegisterPage: React.FC = () => {
  const [flowId, setFlowId] = useState<string | null>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState('');
  const [passkeyPrompting, setPasskeyPrompting] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedFlowId = sessionStorage.getItem(SESSION_KEY);

    if (code && state && storedFlowId) {
      sessionStorage.removeItem(SESSION_KEY);
      submitFlowStep({
        flowId: storedFlowId,
        actionId: '',
        inputs: {
          code, state
        }
      }, handleStep, navigate, setInputs, setLoading);
    } else {
      initializeFlow(setFlowId, handleStep, navigate, searchParams);
    }
  }, []);

  const handleStep = (data: any) => {
    if (data.flowStatus === 'COMPLETE') return navigate('/success');

    switch (data.type) {
      case 'VIEW':
        setFlowId(data.flowId);
        setComponents(data.data.components || []);
        break;

      case 'INTERNAL_PROMPT': {
        const requiredParams = data.data.requiredParams || [];
        const providedInputs: Record<string, any> = {};

        requiredParams.forEach((param: string) => {
          if (param === 'origin') {
            providedInputs.origin = window.location.origin;
          }
        });

        submitFlowStep({
          flowId: data.flowId,
          actionId: '',
          inputs: providedInputs
        }, handleStep, navigate, setInputs, setLoading);
        break;
      }

      case 'WEBAUTHN':
        setPasskeyPrompting(true);
        createPasskey(data.data.webAuthnData)
          .then(({ credentialResponse }: { credentialResponse: PublicKeyCredential }) => {
            const credential = JSON.stringify(credentialResponse);
            submitFlowStep({
              flowId: data.flowId,
              actionId: '',
              inputs: { credential }
            }, handleStep, navigate, setInputs, setLoading);
            setPasskeyPrompting(false);
          })
          .catch((err: { name: string }) => {
            if (err instanceof DOMException && err.name === 'InvalidStateError') {
              setPasskeyError('This passkey is already registered. Try logging in instead.');
            } else {
              navigate('/error');
            }
          });
        break;

      case 'REDIRECTION': {
        const redirectURL = data.data?.redirectURL;
        if (redirectURL && data.flowId) {
          sessionStorage.setItem(SESSION_KEY, data.flowId);
          window.location.href = redirectURL;
        } else {
          navigate('/error');
        }
        break;
      }

      default:
        navigate('/error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      {passkeyPrompting ? (
        <div className="text-center p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <p className="text-lg mb-2">🔐 Verifying Passkey...</p>
          <p className="text-sm">{passkeyError || 'Follow your device prompt'}</p>
        </div>
      ) : (
        <motion.div
          className="w-full max-w-md space-y-5 rounded-2xl bg-white dark:bg-gray-900 shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : (
            components.map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                flowId={flowId}
                actionId={actionId}
                inputs={inputs}
                setInputs={setInputs}
                setActionId={setActionId}
                submit={submitFlowStep}
                handleStep={handleStep}
                setLoading={setLoading}
                navigate={navigate}
              />
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RegisterPage;
