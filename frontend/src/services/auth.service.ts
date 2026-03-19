import type { AuthResponse, LogoutResponse } from '../types/auth.types.ts'

const API_URL = import.meta.env.VITE_BACKEND_URL

export const authService = {
	me: async (): Promise<AuthResponse> => {
		const res = await fetch(`${API_URL}/auth/me`, {
			credentials: 'include'
		})
		
		if (!res.ok) throw new Error('Not authenticated')
		return res.json()
	},

	logout: async (): Promise<LogoutResponse> => {
		const res = await fetch(`${API_URL}/auth/logout`, {
			method: 'POST',
			credentials: 'include'
		})

		if (!res.ok) throw new Error('Logout failed')
		return res.json()
	},

	loginWithGoogle: () => {
		window.location.href = `${API_URL}/auth/google`
	},
}