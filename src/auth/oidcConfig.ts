// src/auth/oidcConfig.ts
const oidcConfig = {
  authority: 'https://your-is-host:9443/oauth2/authorize',
  client_id: 'your-client-id',
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'openid profile email',
  // Optional: silent_redirect_uri, post_logout_redirect_uri, etc.
};

export default oidcConfig;
