# Auth

> Helper functions to work with Auth0

## Usage

### SPA

```js
import createAuth from "@tridnguyen/auth/spa";

const auth0 = await createAuth({
  clientId
});
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
