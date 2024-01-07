# Auth

> Helper functions to work with Auth0

## Usage

### SPA

```js
import createAuth from "@tridnguyen/auth/spa";

const auth0 = await createAuth({
  clientId
  authorizationParams: {
    redirect_uri: window.location.href,
    audience: 'https://lists.cloud.tridnguyen.com',
    scope: 'openid profile email'
  }
});

await auth0.getTokenSilently({
  authorizationParams: {
    audience: 'https://lists.cloud.tridnguyen.com',
    scope: 'read:list write:list'
  }
});

await auth0.logout({
  logoutParams: {
    returnTo: window.location.href
  }
})
```

### Machine to machine

```js
import { getToken } from "@tridnguyen/auth/server";

const token = await getToken({
  clientId,
  clientSecret,
  audience
})
```
