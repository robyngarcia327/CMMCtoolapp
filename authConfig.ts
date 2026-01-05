
// --- AWS COGNITO & IDENTITY POOL CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb";
const IDENTITY_POOL_ID = "us-east-1:14d64338-3f72-4004-9557-b4bb05d0c6c1";
const REGION = "us-east-1";

// Constructed domain based on standard AWS patterns
const COGNITO_DOMAIN = `https://cuallee-cyber.auth.${REGION}.amazoncognito.com`; 

/**
 * CRITICAL REDIRECT URI MATCHING
 * 
 * Your current Request URL shows the app is sending: 
 * https://www.cualleecyber.com (NO SLASH)
 * 
 * If your AWS Console "Allowed Callback URLs" has:
 * https://www.cualleecyber.com/ (WITH SLASH)
 * 
 * YOU MUST ADD the one WITHOUT the slash to your AWS Console.
 */
const PRODUCTION_URL = "https://www.cualleecyber.com";

const getRedirectUri = () => {
  // Always use the production URL when not on localhost to ensure 
  // we never send a dynamic origin that might have a trailing slash 
  // unexpectedly added by the browser.
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
  }
  return PRODUCTION_URL;
};

const redirectUri = getRedirectUri();

export const authConfig = {
  // authority is the base URL for OIDC discovery
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid email profile", 
  // We remove the manual 'metadata' block to allow the OIDC library 
  // to fetch the latest endpoints directly from the .well-known endpoint.
  // This is more reliable for Cognito's token exchange.
  extraQueryParams: {
      // Sometimes needed for Cognito's Hosted UI
      client_id: CLIENT_ID
  }
};
