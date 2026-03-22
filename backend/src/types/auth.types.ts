export interface User {
	id: string
	email: string
	name: string | null
	avatar_url: string | null
}

export interface JwtPayload {
	id: string
	email: string
}