
// --- AWS COGNITO & IDENTITY POOL CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const IDENTITY_POOL_ID = "us-east-1:14d64338-3f72-4004-9557-b4bb05d0c6c1";
const REGION = "us-east-1";

// Constructed domain based on standard AWS patterns
const COGNITO_DOMAIN = `https://cuallee-cyber.auth.${REGION}.amazoncognito.com`; 

/**
 * CRITICAL: AWS Cognito requires an EXACT string match for Redirect URIs.
 * 
 * Your current Request URL in dev tools is sending: https://www.cualleecyber.com
 * 
 * If you still get errors:
 * 1. Log into AWS Console.
 * 2. Go to Cognito User Pool > App Clients > Hosted UI.
 * 3. Add BOTH 'https://www.cualleecyber.com' AND 'https://www.cualleecyber.com/' (with slash).
 */
const getRedirectUri = () => {
  // We use window.location.origin which dynamically captures the protocol + host (e.g. https://www.cualleecyber.com)
  let origin = window.location.origin;
  
  // Standardize: Remove trailing slash for the internal OIDC client to match the sent string
  if (origin.endsWith('/')) {
    origin = origin.slice(0, -1);
  }
  return origin;
};

const redirectUri = getRedirectUri();

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid email profile", 
  cognito_domain: COGNITO_DOMAIN,
  identity_pool_id: IDENTITY_POOL_ID,
  region: REGION,
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: true,
  // Metadata for Cognito specific endpoints
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(redirectUri)}`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  }
};
