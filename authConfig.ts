
// --- AWS COGNITO & IDENTITY POOL CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const REGION = "us-east-1";

// Hardcoded for production to match exactly what you added in AWS Console
const PRODUCTION_URL = "https://www.cualleecyber.com";

/**
 * AWS Cognito is extremely strict. 
 * Since the prompt shows the browser is sending 'https://www.cualleecyber.com' (no slash),
 * we force the library to use this exact string.
 */
const redirectUri = PRODUCTION_URL;

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Cognito-specific logout requires the client_id and logout_uri params
  onEndSession: () => {
    const logoutUrl = `https://cuallee-cyber.auth.${REGION}.amazoncognito.com/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = logoutUrl;
  }
};
