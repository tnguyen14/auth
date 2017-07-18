require('dotenv').config({
	path: 'test/.env'
});

const request = require('supertest');

const app = require('../lib/auth');

describe('Auth', () => {
	it('/login/google redirect to Google', (done) => {
		request(app())
			.get('/login/google')
			.expect(302)
			.expect(
				'location',
				// redirect to google with access_type, redirectUrl, scope (default to profile) and client_id (which is set by env var)
				// example location when running teshdfadfaksdfjafdjasflkfdsfdsadsat
				// https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A55492%2Flogin%2Fgoogle%2Fcallback&scope=profile&client_id=test-google-client-id
				/^https:\/\/accounts.google.com\/.*access_type=offline.*redirect_uri.*%2Flogin%2Fgoogle%2Fcallback.*scope=profile.*client_id=test-google-client-id$/,
				done
			);
	});
});
