import styles from './Navbar.module.css'
import { useAuth } from '../contexts/AuthContext'

export const Navbar = () => {
	const { user, logout } = useAuth();

	return (
		<nav className={styles.nav}>
			<div className={styles.navLogo}>
				<div className={styles.navLogoIcon}>◈</div>
				<span className={styles.navLogoText}>JobTracker</span>
			</div>
			{user && (
				<div className={styles.navRight}>
					<div className={styles.navUser}>
						<div className={styles.avatar}>
							{user?.avatar_url ? (
								<img
									src={user.avatar_url}
									alt={user?.name || user?.email || "User avatar"}
									className={styles.avatarImg}
								/>
							) : (
								user?.name?.charAt(0).toUpperCase() ??
								user?.email?.charAt(0).toUpperCase()
							)}
						</div>
						<span className={styles.navUserName}>{user?.name ?? user?.email}</span>
					</div>
					<button className={styles.navBtn} onClick={logout}>Sign out</button>
				</div>
			)}
		</nav>
	)
}