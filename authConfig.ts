
import { WebStorageStateStore } from "oidc-client-ts";

// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";

// Cognito requires an exact match. 
const REDIRECT_URI = "https://www.cualleecyber.com";

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Use session storage for state to prevent cross-tab or stale-data conflicts
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  // Custom metadata is usually unnecessary if authority is correct
  // but we keep the logout logic custom as Cognito doesn't support standard end_session
  onEndSession: () => {
    const domain = "cuallee-cyber.auth.us-east-1.amazoncognito.com";
    window.location.href = `https://${domain}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
  }
};
