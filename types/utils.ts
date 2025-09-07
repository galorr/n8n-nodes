export async function createToken(userName: string, clientId: string, privateKey: string ) {
	const authClient = require('zoominfo-api-auth-client');

		console.log('authClient:', authClient);
	const token = await authClient.getAccessTokenViaPKI(userName, clientId, privateKey);

		console.log('token:', token);
	return token;
}
