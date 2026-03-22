import { Request, Response } from 'express'
import * as authService from '../services/authService'

export const googleRedirect = (req : Request, res : Response) => {
	const url = authService.getGoogleRedirectUrl()
	res.redirect(url)
}

export const googleCallback = async (req : Request, res : Response) => {
	try {
		const { code } = req.query
		if (!code) return res.status(400).json({ error: 'No code provided' })

		const { token } = await authService.handleGoogleCallback(code as string)

		res.cookie('access_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 1000
		})

		res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
	} catch (err) {
		res.status(500).json({ error: 'Auth failed' })
	}
}

export const me = async (req: Request, res: Response) => {
	const token = req.cookies.access_token
	if (!token) return res.status(401).json({ error: 'Not authenticated' })

	try {
		const user = await authService.getUserFromToken(token)
		res.json({ user })
	} catch (err: any) {
		res.status(401).json({ error: err.message || 'Invalid token' })
	}
}

export const logout = (req: Request, res: Response) => {
	res.clearCookie('access_token')
	res.json({ message: 'Logged out' })
}