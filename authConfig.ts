import { WebStorageStateStore } from "oidc-client-ts";

/**
 * --- MICROSOFT ENTRA ID (AZURE AD) CONFIGURATION ---
 * 
 * To integrate with Microsoft SSO:
 * 1. Register an application in the Azure Portal (App Registrations).
 * 2. Set the Redirect URI to: https://app.cualleecyber.com
 * 3. Enable "ID tokens" in the Authentication tab.
 * 4. Update the Tenant ID and Client ID below.
 */

const TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID || "common"; 
const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID || "YOUR_CLIENT_ID_HERE";
const REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : "https://app.cualleecyber.com");

export const authConfig = {
  authority: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: REDIRECT_URI,
  response_type: "code",
  // Standard Azure AD scopes
  scope: "openid profile email offline_access",
  
  monitorSession: false,
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // Azure AD specific OIDC metadata
  metadata: {
    issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
    authorization_endpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
    token_endpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    userinfo_endpoint: `https://graph.microsoft.com/oidc/userinfo`,
    end_session_endpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    jwks_uri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
  },
  
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};
