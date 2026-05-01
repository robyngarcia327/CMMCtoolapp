import { WebStorageStateStore } from "oidc-client-ts";

/**
 * --- AWS COGNITO CONFIGURATION ---
 */

const REGION = import.meta.env.VITE_COGNITO_REGION || "us-east-1";
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || "us-east-1_ky47RcgYh";

// Attempt to resolve CLIENT_ID from various possible locations in AI Studio
const CLIENT_ID = 
  import.meta.env.VITE_COGNITO_CLIENT_ID || 
  (globalThis as any).process?.env?.VITE_COGNITO_CLIENT_ID || 
  (globalThis as any).process?.env?.COGNITO_CLIENT_ID ||
  ""; // User must provide this in Settings -> Secrets

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: window.location.origin + "/",
  post_logout_redirect_uri: window.location.origin + "/",
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Popup configuration for better iframe compatibility
  popup_redirect_uri: window.location.origin + "/",
  popupWindowFeatures: "location=no,toolbar=no,width=600,height=700,left=100,top=100"
};
