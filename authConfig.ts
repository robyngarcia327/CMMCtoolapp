
import { WebStorageStateStore } from "oidc-client-ts";

// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";
const COGNITO_DOMAIN = "cuallee-cyber.auth.us-east-1.amazoncognito.com";

/**
 * Cognito is extremely sensitive to the Redirect URI.
 * We prioritize the custom domain without the trailing slash as the primary.
 */
const getRedirectUri = () => {
  const origin = window.location.origin;
  const allowed = [
    "https://www.cualleecyber.com",
    "https://cualleecyber.com",
    "https://main.dn9kq53kwmt4m.amplifyapp.com"
  ];
  // If we're on one of the allowed domains, use it exactly as is (origin has no trailing slash)
  return allowed.includes(origin) ? origin : "https://www.cualleecyber.com";
};

const REDIRECT_URI = getRedirectUri();

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // Cognito does not support the OIDC session management spec (iframe)
  monitorSession: false,
  
  // Explicitly defining endpoints ensures the library doesn't hang on a failed .well-known fetch
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `https://${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  },
  
  // Use session storage to isolate login state to the current window
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};
