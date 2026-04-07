import { WebStorageStateStore } from "oidc-client-ts";

/**
 * --- AWS COGNITO CONFIGURATION ---
 */

const REGION = import.meta.env.VITE_COGNITO_REGION;
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

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
