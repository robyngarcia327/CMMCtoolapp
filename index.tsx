
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
    // Immediately remove code/state from URL to prevent loop on refresh
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  },
  onSigninError: (error: Error) => {
    console.error("OIDC Signin Error:", error);
    // If we have a state/code mismatch, it's usually due to a double-redirect.
    // Clearing session storage is the standard fix.
    if (error.message.includes('state') || error.message.includes('code')) {
       sessionStorage.clear();
       // Auto-reload to give the user a clean slate
       window.location.href = window.location.origin;
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
