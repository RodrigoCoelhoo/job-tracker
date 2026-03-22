import { getGoogleAuthUrl, googleClient } from '../lib/google'
import { supabase } from '../lib/supabase'
import { signToken, verifyToken } from '../lib/jwt'
import { User } from '../types/auth.types'

export const getGoogleRedirectUrl = () => {
	return getGoogleAuthUrl()
}

export const handleGoogleCallback = async (code: string) => {
	const { tokens } = await googleClient.getToken(code)
	googleClient.setCredentials(tokens)

	const ticket = await googleClient.verifyIdToken({
		idToken: tokens.id_token!,
		audience: process.env.GOOGLE_CLIENT_ID
	})

	const payload = ticket.getPayload()!

	const googleId = payload.sub
	const email = payload.email!
	const name = payload.name ?? null
	const avatar_url = payload.picture ?? null

	let { data: user } = await supabase
		.from('users')
		.select('*')
		.eq('google_id', googleId)
		.single()

	if (!user) {
		const { data: newUser } = await supabase
			.from('users')
			.insert({ email, name, avatar_url, google_id: googleId })
			.select()
			.single()

		user = newUser
	}

	const token = signToken({ id: user.id, email: user.email })

	return { user, token }
}

export const getUserFromToken = async (token: string) : Promise<User> => {
	const decoded = verifyToken(token)

	const { data: user } = await supabase
		.from('users')
		.select('*')
		.eq('id', decoded.id)
		.single()

	if (!user) throw new Error('User not found')

	return user
}