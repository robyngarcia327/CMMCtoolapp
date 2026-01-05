
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from "react-oidc-context";
import { authConfig } from './authConfig';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const oidcConfig = {
  ...authConfig,
  // This cleans up the URL after redirecting back from Cognito
  onSigninCallback: (_user: any): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  // Handle login errors globally
  onSigninError: (error: Error) => {
    console.error("OIDC Signin Error:", error);
    // If we have a state mismatch, it's often best to clear everything and restart
    if (error.message.includes('state')) {
       sessionStorage.clear();
       localStorage.removeItem(`oidc.user:${authConfig.authority}:${authConfig.client_id}`);
    }
  }
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
