# Auth

[![Build Status](https://travis-ci.org/tnguyen14/auth.svg?branch=master)](https://travis-ci.org/tnguyen14/auth)

Express-based authentication module with support for Google OAuth 2.0. Session is backed by [`cookie-session`](https://github.com/expressjs/cookie-session), with optional support for auth across subdomains.

## Usage

In your express app:

```javascript
var auth = require('@tridnguyen/auth');

app.use('/auth', auth(opts));
```

### Options

`opts.cors`: enable CORS support. Defaults to `false`.

### Environment variables

This module relies on a few environment variables to be set. These can be set in a `.env` file (if using the [`dotenv`](https://www.npmjs.com/package/dotenv) module).

- `COOKIE_NAME`: name of the cookie to set.
- `COOKIE_SECRET`: secret used to sign and verify cookie.
- `COOKIE_DOMAIN`: domain of the cookie (use something like `.mysite.com` to enable cookie for subdomains).
- `AUTHORIZED_ORIGINS`: comma-separated list of allowed origins (see `opt.cors`).
- `GOOGLE_CLIENT_ID`: Client ID of the Google App used for authenticating with Google.
- `GOOGLE_CLIENT_SECRET`: Client secret of the Google App.
- `AUTH_URL`: URL of the service. This value, appended with `/login/google/callback`, will be the callback URL by Google. It should be one of the "Authorized redirect URIs" configured on the Google API Console.
- `REDIRECT_URL`: URL to redirect to once the authentication with Google is complete. Defaults to `/profile`.

