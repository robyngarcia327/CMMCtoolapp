
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
    // Remove OIDC parameters and restore the protected route requested before login.
    const returnPath = sessionStorage.getItem('cuallee_return_path') || '/';
    sessionStorage.removeItem('cuallee_return_path');
    window.history.replaceState({}, document.title, window.location.origin + returnPath);
  },
  onSigninError: (error: Error) => {
    console.error("OIDC Signin Error:", error);
    // If we have a state/code mismatch, it's usually due to a double-redirect.
    // Clearing session storage is the standard fix, but we only do it once.
    if (error.message.includes('state') || error.message.includes('code')) {
       const hasReloaded = sessionStorage.getItem('oidc_error_reloaded');
       if (!hasReloaded) {
           sessionStorage.setItem('oidc_error_reloaded', 'true');
           sessionStorage.clear();
           window.location.href = window.location.origin;
       } else {
           console.warn("OIDC error persisted after reload. Stopping loop.");
       }
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
