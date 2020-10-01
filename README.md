# Auth

Client-side JWT auth using local storage and Auth0 OAuth2 flow.

## Usage

```js
import { getSession, deleteSession, createAuth } from "@tridnguyen/auth";

const auth = createAuth();

auth.handleCallback((err) => {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log(getSession());
  }
});

function login() {
  auth.silentAuth();
}

function logout() {
  deleteSession();
}

const session = getSession();
/*
 * session = {
 *   expiresAt,
 *   accessToken,
 *   idToken,
 *   profile: {
 *     given_name,
 *     family_name,
 *     nickname,
 *     name,
 *     picture,
 *     sub
 *   }
 * }
 */

if (!session) {
  console.log("Unauthenticated");
  login();
}
```
