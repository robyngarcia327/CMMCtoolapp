
import { WebStorageStateStore } from "oidc-client-ts";

// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";

/**
 * Your app is now moving to the 'app' subdomain.
 * IMPORTANT: You MUST update your Cognito App Client settings in the AWS Console
 * to include https://app.cualleecyber.com in "Allowed Callback URLs".
 */
const COGNITO_DOMAIN = "us-east-1ky47rcgyh.auth.us-east-1.amazoncognito.com";
const REDIRECT_URI = "https://app.cualleecyber.com";

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "openid email",
  
  monitorSession: false,
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `https://${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  },
  
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};
