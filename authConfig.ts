
import { WebStorageStateStore } from "oidc-client-ts";

// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";

/**
 * Dynamic Redirect URI Detection
 * This ensures the URI sent to Cognito matches exactly what is in the browser address bar.
 * Matches entries in your Cognito 'Allowed callback URLs' list.
 */
const getRedirectUri = () => {
  // window.location.origin returns 'https://www.cualleecyber.com' (no trailing slash)
  // This matches entries 1, 3, and 5 in your provided list.
  return window.location.origin;
};

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: getRedirectUri(),
  post_logout_redirect_uri: getRedirectUri(),
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Ensure state is isolated to the session to prevent "State Mismatch" errors on refresh
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  // Custom logout for Cognito
  onEndSession: () => {
    const domain = "cuallee-cyber.auth.us-east-1.amazoncognito.com";
    const logoutUri = getRedirectUri();
    window.location.href = `https://${domain}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }
};
