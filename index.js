/* global localStorage */
import jwtDecode from "jwt-decode";
import pick from "lodash.pick";
import auth0 from "auth0-js";

// claims that are relevant
const userClaims = [
  "given_name",
  "family_name",
  "nickname",
  "name",
  "picture",
  "sub",
];
// decode user info from idToken
function getUser(idToken) {
  const payload = jwtDecode(idToken);
  return pick(payload, userClaims);
}

function isAuthenticated(user) {
  return Date.now() < user.expiresAt;
}

export function storeSession(user) {
  if (!user.accessToken && user.idToken) {
    throw new Error("accessToken and idToken are required");
  }
  let expiresAt = user.expiresAt;
  if (!expiresAt && user.expiresIn) {
    expiresAt = user.expiresIn * 1000 + Date.now();
  }

  localStorage.setItem("access_token", user.accessToken);
  localStorage.setItem("id_token", user.idToken);
  localStorage.setItem("expires_at", JSON.stringify(expiresAt));
}

export function deleteSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("expires_at");
}

export function getSession() {
  const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
  if (isAuthenticated({ expiresAt })) {
    // Auth0 example does not retrieve these tokens
    // but it seems like they should be
    const accessToken = localStorage.getItem("access_token");
    const idToken = localStorage.getItem("id_token");
    return {
      expiresAt,
      accessToken,
      idToken,
      profile: getUser(idToken),
    };
  }
  // if not authenticated, remove any existing session
  deleteSession();
}

export function createAuth(options) {
  const scope = (options && options.scope) || "openid profile email";
  const redirectUri = (options && options.redirectUri) || window.location.href;
  const basePath = (options && options.basePath) || window.location.pathname;

  const auth = new auth0.WebAuth({
    domain: "tridnguyen.auth0.com",
    clientID: "IxcfVZqCVF9b5FS2NVVnElOeBnoNG02Z",
    audience: "https://tridnguyen.auth0.com/userinfo",
    responseType: "token id_token",
    scope,
  });

  auth.silentAuth = () => {
    auth.authorize({
      redirectUri,
      prompt: "none",
    });
  };

  auth.handleCallback = (callback) => {
    if (!window.location.hash.startsWith("#access_token")) {
      if (callback) {
        callback();
        return;
      }
    }
    auth.parseHash((err, authResult) => {
      if (err) {
        if (err.error === "login_required") {
          auth.authorize({
            redirectUri,
          });
        } else {
          if (callback) {
            callback(err);
          }
        }
        return;
      }
      try {
        storeSession(authResult);
        /*
         * clear out callback hash
         * use history module once the issue is resolved
         * https://github.com/ReactTraining/history/issues/821
         */
        history.replaceState(null, "", basePath);
        if (callback) {
          callback(null, authResult);
        }
      } catch (e) {
        if (callback) {
          callback(e);
        }
      }
    });
  };

  auth.renewSession = (callback) => {
    auth.checkSession(
      {
        redirectUri,
      },
      (err, authResult) => {
        if (err) {
          if (callback) {
            callback(err);
            return;
          }
        }
        try {
          storeSession(authResult);
          if (callback) {
            callback(null, authResult);
          }
        } catch (e) {
          if (callback) {
            callback(e);
          }
        }
      }
    );
  };

  return auth;
}
