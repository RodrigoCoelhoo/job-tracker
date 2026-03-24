import type { AuthResponse, LogoutResponse } from '../types/auth.types'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`

export const authService = {
	me: async (): Promise<AuthResponse> => {
		const res = await fetch(`${API_URL}/me`, {
			credentials: 'include'
		})

		if (!res.ok) throw new Error('Not authenticated')
		return res.json()
	},

	logout: async (): Promise<LogoutResponse> => {
		const res = await fetch(`${API_URL}/logout`, {
			method: 'POST',
			credentials: 'include'
		})

		if (!res.ok) throw new Error('Logout failed')
		return res.json()
	},

	loginWithGoogle: () => {
		window.location.href = `${API_URL}/google`
	},
}