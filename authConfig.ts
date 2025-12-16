// --- AWS COGNITO CONFIGURATION ---
// 1. Go to AWS Console -> Cognito -> User Pools -> [Your Pool]
// 2. Copy "User Pool ID"
// 3. Go to App Integration -> App client list -> Copy "Client ID"
// 4. Go to App Integration -> Domain -> Copy your full domain URL

// TODO: Verify these match your AWS Console exactly
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb"; 

// UPDATED: This matches the URL you saw when clicking "View login page"
const COGNITO_DOMAIN = "https://us-east-1ky47rcgyh.auth.us-east-1.amazoncognito.com"; 

export const authConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  // This uses the current browser URL (e.g., https://cualleecyber.com or https://main...amplifyapp.com)
  // You MUST add this exact value to "Allowed Callback URLs" in Cognito Console
  redirect_uri: window.location.origin, 
  response_type: "code",
  scope: "phone openid email",
  cognito_domain: COGNITO_DOMAIN,
};