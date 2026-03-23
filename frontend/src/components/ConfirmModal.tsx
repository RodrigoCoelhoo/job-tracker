import styles from './ConfirmModal.module.css'

interface Props {
	title: string
	message: string
	confirmLabel?: string
	onConfirm: () => void
	onCancel: () => void
}

export const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: Props) => {
	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.message}>{message}</p>
				<div className={styles.footer}>
					<button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
					<button className={styles.confirmBtn} onClick={onConfirm}>{confirmLabel}</button>
				</div>
			</div>
		</div>
	)
}