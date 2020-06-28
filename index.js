/* global localStorage */
import jwtDecode from 'jwt-decode';
import pick from 'lodash.pick';
import auth0 from 'auth0-js';

// claims that are relevant
const userClaims = [
	'given_name',
	'family_name',
	'nickname',
	'name',
	'picture',
	'sub'
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
	localStorage.setItem('access_token', user.accessToken);
	localStorage.setItem('id_token', user.idToken);
	localStorage.setItem('expires_at', JSON.stringify(user.expiresAt));
}

export function deleteSession() {
	localStorage.removeItem('access_token');
	localStorage.removeItem('id_token');
	localStorage.removeItem('expires_at');
}

export function getSession() {
	const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
	if (isAuthenticated({ expiresAt })) {
		// Auth0 example does not retrieve these tokens
		// but it seems like they should be
		const accessToken = localStorage.getItem('access_token');
		const idToken = localStorage.getItem('id_token');
		return {
			expiresAt,
			accessToken,
			idToken,
			profile: getUser(idToken)
		};
	}
	// if not authenticated, remove any existing session
	deleteSession();
}

const auth = new auth0.WebAuth({
  domain: 'tridnguyen.auth0.com',
  clientID: 'IxcfVZqCVF9b5FS2NVVnElOeBnoNG02Z',
  audience: 'https://tridnguyen.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile'
});

export default auth;
