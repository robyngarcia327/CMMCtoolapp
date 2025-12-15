import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from "react-oidc-context";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ky47RcgYh",
  client_id: "5pe5430hrtohupn12gj8r66qtb",
  // We use window.location.origin so this works on localhost, preview, and production dynamically.
  // Ensure ALL these URLs are added to your Cognito User Pool "Allowed Callback URLs".
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "phone openid email",
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);