import auth0 from 'auth0';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import debug from 'debug';

const log = debug('@tridnguyen/auth');

const { AuthenticationClient } = auth0;

const AUTH0_DOMAIN = 'tridnguyen.auth0.com';

let token;

var client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function verifyJwt(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, getKey, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  })
}

export async function getToken(options) {
  if (!options.clientId || !options.clientSecret) {
    throw new Error('clientId and clientSecret are required');
  }

  if (token) {
    try {
      await verifyJwt(token);
      log('Previous token still valid.');
      return token;
    } catch (e) {
      token = undefined;
    }
  }
  log('Getting client credentials grant access token');
  const auth0 = new AuthenticationClient({
    domain: AUTH0_DOMAIN,
    ...options,
  });
  const response = await auth0.clientCredentialsGrant({
    audience: options.audience,
  });
  token = response.access_token;

  return response.access_token;
}
