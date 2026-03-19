import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
	const { user, logout } = useAuth()

	return (
		<div>
			<h1>Welcome, {user?.email}!</h1>
			<button onClick={logout}>Logout</button>
		</div>
	)
}