export interface User {
	id: string
	email: string
	name: string | null
	avatar_url: string | null
}

export interface AuthResponse {
	user: User
}

export interface LogoutResponse {
	message: string
}