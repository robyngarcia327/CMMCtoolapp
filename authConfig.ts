
// --- AWS COGNITO CONFIGURATION ---
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb"; 
const COGNITO_DOMAIN = "https://us-east-1ky47rcgyh.auth.us-east-1.amazoncognito.com"; 

const getRedirectUri = () => {
  // Use current origin. We must be consistent with the trailing slash.
  // Standardizing on NO trailing slash unless it's strictly the root domain.
  let origin = window.location.origin;
  
  // If the origin is just a protocol + domain (e.g., http://localhost:5173 or https://cuallee.com)
  // we check if Cognito expects the slash. Most Cognito setups are sensitive to this.
  // Standardizing here to return exactly what is usually configured in the AWS Console.
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

const redirectUri = getRedirectUri();

export const authConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: "code",
  scope: "phone openid email",
  cognito_domain: COGNITO_DOMAIN,
  metadata: {
    issuer: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(redirectUri)}`,
    jwks_uri: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  }
};
