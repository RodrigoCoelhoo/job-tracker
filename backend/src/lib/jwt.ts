import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export const signToken = (payload: JwtPayload) => {
	return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload
}