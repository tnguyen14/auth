import { postJson } from 'simple-fetch';

export async function getToken(options) {
  if (!options.clientId || !options.clientSecret) {
    throw new Error('clientId and clientSecret are required');
  }

  const response = await postJson(
    'https://tridnguyen.auth0.com/oauth/token',
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      audience: options.audience,
      grant_type: 'client_credentials'
    }
  );

  return response.access_token;
}
