import { WebStorageStateStore } from "oidc-client-ts";

/**
 * --- AWS COGNITO CONFIGURATION ---
 */

const REGION = import.meta.env.VITE_COGNITO_REGION || "us-east-1";
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || "us-east-1_ky47RcgYh";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "7m2m6m6m6m6m6m6m6m6m6m6m6m"; // Placeholder, will be updated if real one found
export const cognitoHostedUiDomain = (
  import.meta.env.VITE_COGNITO_DOMAIN ||
  "https://us-east-1ky47rcgyh.auth.us-east-1.amazoncognito.com"
).replace(/\/$/, "");

export const authConfig = {
  authority: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  automaticSilentRenew: true,
  loadUserInfo: true,
};
