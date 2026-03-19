import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export const signToken = (payload: { id: string; email: string }) => {
	return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export const verifyToken = (token: string) => {
	return jwt.verify(token, SECRET) as { id: string; email: string }
}