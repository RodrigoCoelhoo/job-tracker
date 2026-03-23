import styles from './AuthCallback.module.css'

export default function AuthCallback() {
	return (
		<div className={styles.container}>
			<div className={styles.dots}>
				<span className={styles.dot} />
				<span className={styles.dot} />
				<span className={styles.dot} />
			</div>
		</div>
	)
}