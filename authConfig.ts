
// --- AWS COGNITO & IDENTITY POOL CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const IDENTITY_POOL_ID = "us-east-1:14d64338-3f72-4004-9557-b4bb05d0c6c1";
const REGION = "us-east-1";

// Constructed domain based on standard AWS patterns
const COGNITO_DOMAIN = `https://cuallee-cyber.auth.${REGION}.amazoncognito.com`; 

/**
 * CRITICAL: AWS Cognito requires an EXACT string match for Redirect URIs.
 * If this function returns 'https://www.cualleecyber.com', then your 
 * AWS Console MUST NOT have a trailing slash (/) at the end of the URL.
 */
const getRedirectUri = () => {
  // Use window.location.origin to support local dev, staging, and prod dynamically
  let origin = window.location.origin;
  // Standardize: Remove trailing slash if present
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

const redirectUri = getRedirectUri();

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: "phone openid email profile aws.cognito.signin.user.admin",
  cognito_domain: COGNITO_DOMAIN,
  identity_pool_id: IDENTITY_POOL_ID,
  region: REGION,
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    // Standard Cognito logout endpoint construction
    end_session_endpoint: `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(redirectUri)}`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  }
};
