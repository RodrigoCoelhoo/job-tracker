import { Router, Request, Response } from 'express'
import { googleClient, getGoogleAuthUrl } from '../lib/google'
import { signToken, verifyToken } from '../lib/jwt'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/google', (req: Request, res: Response) => {
	const url = getGoogleAuthUrl()
	res.redirect(url)
})

router.get('/callback', async (req: Request, res: Response) => {
	const { code } = req.query

	if (!code) {
		return res.status(400).json({ error: 'No code provided' })
	}

	const { tokens } = await googleClient.getToken(code as string)
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

	res.cookie('access_token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 1000
	})

	res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
})

router.get('/me', async (req: Request, res: Response) => {
	const token = req.cookies.access_token

	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' })
	}

	try {
		const decoded = verifyToken(token)

		const { data: user } = await supabase
			.from('users')
			.select('*')
			.eq('id', decoded.id)
			.single()

		if (!user) return res.status(401).json({ error: 'User not found' })

		res.json({ user })
	} catch {
		res.status(401).json({ error: 'Invalid token' })
	}
})

router.post('/logout', (req: Request, res: Response) => {
	res.clearCookie('access_token')
	res.json({ message: 'Logged out' })
})

export default router