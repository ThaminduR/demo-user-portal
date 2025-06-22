import React from 'react';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';

export const ComponentRenderer = ({
  component,
  flowId,
  actionId,
  inputs,
  setInputs,
  setActionId,
  submit,
  handleStep,
  setLoading,
  navigate,
}: any) => {
  const { id, config, type, variant } = component;

  const handleClick = () => {
    setActionId(id);
    if (config.type !== 'submit' && flowId) {
      submit({ flowId, actionId: id, inputs }, handleStep, navigate, setInputs, setLoading);
    }
  };

  switch (type) {
    case 'TYPOGRAPHY':
      const Tag = variant === 'H1' ? 'h1' : variant === 'H2' ? 'h2' : 'h3';
      return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Tag className="font-semibold text-gray-800 dark:text-white mb-4 text-lg">
            {config.text}
          </Tag>
        </motion.div>
      );

    case 'INPUT':
      return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <label htmlFor={config.identifier} className="block text-sm font-medium mb-1">
            {config.label}
          </label>
          <input
            id={config.identifier}
            type={config.type}
            required={config.required}
            value={inputs[config.identifier] || ''}
            placeholder={config.placeholder}
            className="w-full px-3 py-2 border rounded-md shadow-sm dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            onChange={(e) =>
              setInputs((prev: any) => ({
                ...prev,
                [config.identifier]: e.target.value,
              }))
            }
          />
        </motion.div>
      );

    case 'BUTTON':
      return (
        <Transition
          appear
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="mt-3">
            <button
              type={config.type}
              onClick={handleClick}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                variant === 'PRIMARY'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 focus:ring-gray-500'
              }`}
            >
              {config.text}
            </button>
          </div>
        </Transition>
      );

    case 'DIVIDER':
      return (
        <motion.div layout className="flex items-center my-6 gap-3 text-sm text-gray-500">
          <div className="flex-grow border-t border-gray-300" />
          {config.text && <span>{config.text}</span>}
          <div className="flex-grow border-t border-gray-300" />
        </motion.div>
      );

    case 'FORM':
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (flowId) {
              submit({ flowId, actionId, inputs }, handleStep, navigate, setInputs, setLoading);
            }
          }}
          className="space-y-5"
        >
          {component.components.map((sub: any) =>
            <ComponentRenderer
              key={sub.id}
              component={sub}
              flowId={flowId}
              actionId={actionId}
              inputs={inputs}
              setInputs={setInputs}
              setActionId={setActionId}
              submit={submit}
              handleStep={handleStep}
              setLoading={setLoading}
              navigate={navigate}
            />
          )}
        </form>
      );

    default:
      return null;
  }
};
