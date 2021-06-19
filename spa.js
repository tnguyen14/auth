import createAuth0Client from 'auth0/auth0-spa-js';

export async function createAuth(options) {
  if (!options.clientId) {
    throw new Error('clientId is required');
  }
  const client = await createAuth0Client({
    domain: 'tridnguyen.auth0.com',
    client_id: options.clientId,
    redirect_uri: window.location.href,
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
  });
  return client;
}
