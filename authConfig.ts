
// --- AWS COGNITO & IDENTITY POOL CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";
const COGNITO_DOMAIN = "cuallee-cyber.auth.us-east-1.amazoncognito.com";

// Exactly as configured in your AWS Console
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
  // Explicit metadata fixes common discovery errors in AWS Cognito
  metadata: {
    issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `https://${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`,
    jwks_uri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  }
};
