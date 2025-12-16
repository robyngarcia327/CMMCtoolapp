// --- AWS COGNITO CONFIGURATION ---
// 1. Go to AWS Console -> Cognito -> User Pools -> [Your Pool]
// 2. Copy "User Pool ID" (e.g., us-east-1_xxxxxx)
// 3. Go to App Integration -> App client list -> Copy "Client ID"
// 4. Go to App Integration -> Domain -> Copy your full domain URL (It looks like https://<prefix>.auth.us-east-1.amazoncognito.com)

// TODO: Replace these values with YOUR specific AWS Cognito details
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb"; 

// IMPORTANT: This must be the Cognito Domain, NOT your CloudFront URL.
// It allows the app to perform the logout redirect correctly.
const COGNITO_DOMAIN = "https://cualli-cyber.auth.us-east-1.amazoncognito.com"; 

export const authConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  // Automatically handles localhost vs production (CloudFront)
  redirect_uri: window.location.origin, 
  response_type: "code",
  scope: "phone openid email",
  cognito_domain: COGNITO_DOMAIN,
};