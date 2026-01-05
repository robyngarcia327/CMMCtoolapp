
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
    // Standardize URL cleanup
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  },
  // Handle login errors globally
  onSigninError: (error: Error) => {
    console.error("OIDC Signin Error:", error);
    // State mismatches are usually fixed by clearing storage and URL
    if (error.message.includes('state') || error.message.includes('code')) {
       sessionStorage.clear();
       const cleanUrl = window.location.origin + window.location.pathname;
       window.history.replaceState({}, document.title, cleanUrl);
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
