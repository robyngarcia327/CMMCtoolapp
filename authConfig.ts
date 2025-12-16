// --- AWS COGNITO CONFIGURATION ---
// 1. Go to AWS Console -> Cognito -> User Pools -> [Your Pool]
// 2. Copy "User Pool ID"
// 3. Go to App Integration -> App client list -> Copy "Client ID"
// 4. Go to App Integration -> Domain -> Copy your full domain URL

const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb"; 
const COGNITO_DOMAIN = "https://us-east-1ky47rcgyh.auth.us-east-1.amazoncognito.com"; 

// Remove trailing slash if present to avoid mismatch with AWS Console settings
const ORIGIN = window.location.origin.replace(/\/$/, '');

export const authConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: ORIGIN, 
  response_type: "code",
  scope: "phone openid email",
  cognito_domain: COGNITO_DOMAIN,
  // IMPORTANT: We manually define metadata to force the library to use the 
  // Custom Domain you verified (us-east-1ky47rcgyh...) instead of the generic one.
  metadata: {
    issuer: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${COGNITO_DOMAIN}/logout`,
    jwks_uri: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
  }
};