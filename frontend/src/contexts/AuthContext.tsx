import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/auth.service'
import type { User } from '../types/auth.types'

interface AuthContextType {
	user: User | null
	loading: boolean
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		authService.me()
			.then(data => setUser(data.user))
			.catch(() => setUser(null))
			.finally(() => setLoading(false))
	}, [])

	const logout = async () => {
		await authService.logout()
		setUser(null)
		window.location.href = '/'
	}

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within AuthProvider')
	return context
}