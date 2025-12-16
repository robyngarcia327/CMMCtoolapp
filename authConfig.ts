// --- AWS COGNITO CONFIGURATION ---
// 1. Go to AWS Console -> Cognito -> User Pools -> [Your Pool]
// 2. Copy "User Pool ID" (e.g., us-east-1_xxxxxx)
// 3. Go to App Integration -> App client list -> Copy "Client ID"
// 4. Go to App Integration -> Domain -> Copy your full domain URL

// TODO: Replace these values with YOUR specific AWS Cognito details
const USER_POOL_ID = "us-east-1_ky47RcgYh"; 
const CLIENT_ID = "5pe5430hrtohupn12gj8r66qtb"; 
const COGNITO_DOMAIN = "https://d84l1y8p4kdic.cloudfront.net"; 

export const authConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ky47RcgYh`,
  client_id: CLIENT_ID,
  redirect_uri: "https://d84l1y8p4kdic.cloudfront.net", // Automatically detects localhost or production URL
  response_type: "code",
  scope: "phone openid email",
  cognito_domain: COGNITO_DOMAIN,
};
