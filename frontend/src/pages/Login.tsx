import { authService } from '../services/auth.service'

export default function Login() {
	return (
		<div>
			<h1>Welcome</h1>
			<button onClick={authService.loginWithGoogle}>
				Sign in with Google
			</button>
		</div>
	)
}