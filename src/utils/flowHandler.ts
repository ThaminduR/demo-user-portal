import axios from 'axios';
import { API_BASE, SESSION_KEY } from './constants';

export const submitFlowStep = async (
  payload: any,
  handleStep: (data: any) => void,
  navigate: any,
  setInputs: (v: any) => void,
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  try {
    const res = await axios.post(API_BASE, payload);
    setInputs({});
    handleStep(res.data);
  } catch {
    navigate('/error');
  } finally {
    setLoading(false);
  }
};

export const handleCallbackIfPresent = (
  searchParams: URLSearchParams,
  setFlowId: (id: string) => void,
  submit: typeof submitFlowStep,
  navigate: any,
  setInputs: (v: any) => void
) => {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const mlt = searchParams.get('mlt');
  const urlFlowId = searchParams.get('flowId');
  const storedFlowId = sessionStorage.getItem(SESSION_KEY);

  if (code && state && storedFlowId) {
    sessionStorage.removeItem(SESSION_KEY);
    submit({
      flowId: storedFlowId,
      actionId: '',
      inputs: {
        code,
        state,
      }
    }, () => {}, navigate, setInputs, () => {});
    return;
  }

  if (urlFlowId && mlt) {
    setFlowId(urlFlowId);
    submit({
      flowId: urlFlowId,
      actionId: '',
      inputs: { mlt }
    }, () => {}, navigate, setInputs, () => {});
  }
};

export const initializeFlow = async (
  setFlowId: (id: string) => void,
  handleStep: (data: any) => void,
  navigate: any,
  searchParams: URLSearchParams
) => {
  const urlFlowId = searchParams.get('flowId');
  const mlt = searchParams.get('mlt');

  if (urlFlowId && mlt) return; // Already handled in callback

  try {
    const res = await axios.post(API_BASE, { flowType: 'REGISTRATION' });
    setFlowId(res.data.flowId);
    handleStep(res.data);
  } catch {
    navigate('/error');
  }
};
