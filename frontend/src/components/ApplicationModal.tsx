import { useState, useEffect } from 'react'
import type { Application, ApplicationForm, Status, Type } from '../types/application.types'
import styles from './ApplicationModal.module.css'
import { ConfirmModal } from './ConfirmModal'

type Mode = 'add' | 'edit'

interface Props {
	mode: Mode
	application?: Application
	onClose: () => void
	onSubmit: (data: ApplicationForm) => void
	onDelete?: () => void
}

const emptyForm = {
	company: '',
	role: '',
	location: '',
	type: 'Full-time' as Type,
	status: 'Applied' as Status,
	notes: '',
	date: new Date().toISOString().split('T')[0],
}

export const ApplicationModal = ({ mode, application, onClose, onSubmit, onDelete }: Props) => {
	const [form, setForm] = useState(emptyForm)
	const [confirmDelete, setConfirmDelete] = useState(false)

	useEffect(() => {
		if (mode === 'edit' && application) {
			setForm({
				company: application.company,
				role: application.role,
				location: application.location,
				type: application.type,
				status: application.status,
				notes: application.notes ?? '',
				date: new Date(application.date).toISOString().split('T')[0],
			})
		}
	}, [mode, application])

	const set = (field: string, value: string) =>
		setForm(prev => ({ ...prev, [field]: value }))

	const handleSubmit = () => {
		if (!form.company.trim() || !form.role.trim()) return
		onSubmit({
			...form,
			date: new Date(form.date)
		})
	}

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose()
	}

	return (
		<div className={styles.overlay} onClick={handleOverlayClick}>
			<div className={styles.modal}>

				{/* Header */}
				<div className={styles.header}>
					<h2 className={styles.title}>
						{mode === 'add' ? 'Add Application' : 'Edit Application'}
					</h2>
					<button className={styles.closeBtn} onClick={onClose}>×</button>
				</div>

				{/* Body */}
				<div className={styles.body}>

					{/* Company */}
					<div className={styles.row}>
						<label className={styles.label}>Company *</label>
						<input
							className={styles.input}
							placeholder="e.g. Stripe"
							value={form.company}
							onChange={e => set('company', e.target.value)}
						/>
					</div>

					<div className={styles.row}>
						<label className={styles.label}>Role *</label>
						<input
							className={styles.input}
							placeholder="e.g. Backend Engineer"
							value={form.role}
							onChange={e => set('role', e.target.value)}
						/>
					</div>

					{/* Location + Type */}
					<div className={styles.row2}>
						<div className={styles.row}>
							<label className={styles.label}>Location</label>
							<input
								className={styles.input}
								placeholder="e.g. Remote"
								value={form.location}
								onChange={e => set('location', e.target.value)}
							/>
						</div>
						<div className={styles.row}>
							<label className={styles.label}>Type</label>
							<select
								className={styles.select}
								value={form.type}
								onChange={e => set('type', e.target.value)}
							>
								<option>Full-time</option>
								<option>Part-time</option>
								<option>Contract</option>
								<option>Internship</option>
								<option>Freelance</option>
							</select>
						</div>
					</div>

					{/* Status + Date */}
					<div className={styles.row2}>
						<div className={styles.row}>
							<label className={styles.label}>Status</label>
							<select
								className={styles.select}
								value={form.status}
								onChange={e => set('status', e.target.value as Status)}
							>
								<option>Applied</option>
								<option>Interview</option>
								<option>Offer</option>
								<option>Rejected</option>
								<option>Ghosted</option>
							</select>
						</div>
						<div className={styles.row}>
							<label className={styles.label}>Apply Date</label>
							<input
								className={styles.input}
								type="date"
								value={form.date}
								onChange={e => set('date', e.target.value)}
							/>
						</div>
					</div>

					{/* Notes */}
					<div className={styles.row}>
						<label className={styles.label}>Notes</label>
						<textarea
							className={styles.textarea}
							placeholder="Any notes about this application..."
							value={form.notes}
							onChange={e => set('notes', e.target.value)}
						/>
					</div>

				</div>

				{/* Footer */}
				<div className={styles.footer}>
					{mode === 'edit' && onDelete && (
						<button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>
							🗑 Delete
						</button>
					)}
					<button className={styles.cancelBtn} onClick={onClose}>
						Cancel
					</button>
					<button className={styles.submitBtn} onClick={handleSubmit}>
						{mode === 'add' ? 'Add Application' : 'Save Changes'}
					</button>
				</div>

			</div>

			{confirmDelete && (
				<ConfirmModal
					title="Delete Application"
					message={`Are you sure you want to delete '${form.company}'? This will also delete all interviews and cannot be undone.`}
					confirmLabel="Yes, delete"
					onConfirm={onDelete!}
					onCancel={() => setConfirmDelete(false)}
				/>
			)}
		</div>
	)
}