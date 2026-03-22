import { Request, Response, NextFunction } from 'express'
import { JwtPayload as AppJwtPayload } from '../types/auth.types'
import { verifyToken } from '../lib/jwt'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.access_token

	if (!token) {
		return res.status(401).json({ error: 'Not authenticated' })
	}

	try {
		const decoded = verifyToken(token) as AppJwtPayload
		req.user = decoded
		next()
	} catch {
		res.status(401).json({ error: 'Invalid or expired token' })
	}
}