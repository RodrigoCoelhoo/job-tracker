import { google } from 'googleapis'

export const googleClient = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	`${process.env.BACKEND_URL}/auth/callback`
)

export const getGoogleAuthUrl = () => {
	return googleClient.generateAuthUrl({
		access_type: 'offline',
		scope: ['email', 'profile']
	})
}