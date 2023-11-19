import createAuth0Client from '@auth0/auth0-spa-js';

export default async function createAuth(options) {
  if (!options.clientId) {
    throw new Error('clientId is required');
  }
  const client = await createAuth0Client({
    domain: 'tridnguyen.auth0.com',
    client_id: options.clientId,
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    useRefreshTokensFallback: true,
    authorizationParams: {
      redirect_uri: window.location.href,
    }
  });
  return client;
}
