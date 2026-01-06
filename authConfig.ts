
import { WebStorageStateStore } from "oidc-client-ts";

// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";

// Using window.location.origin ensures we send a URI that exactly matches your Cognito whitelist.
const REDIRECT_URI = window.location.origin;

export const authConfig = {
  // Authority is the primary OIDC discovery endpoint for Cognito
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "openid email profile",
  
  // REQUIRED FOR COGNITO: Cognito does not support session monitoring iframes
  monitorSession: false,
  
  // Ensures tokens are renewed in the background when they expire
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // Use session storage to keep the auth state local to the browser tab
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};
