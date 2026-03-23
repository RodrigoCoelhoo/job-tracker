import { useEffect, useState } from "react"
import type { Application, Status } from "../types/application.types"
import type { Interview } from "../types/interview.types"
import styles from './ApplicationDetails.module.css'
import { InterviewCard } from "./InterviewCard"
import { interviewService } from "../services/interview.service"
import { ConfirmModal } from "./ConfirmModal"

type Props = {
	application: Application
	onClose: () => void
	onEdit: () => void
}

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const emptyForm = {
	title: '',
	date: new Date().toISOString().split('T')[0],
	time: new Date().toISOString().split('T')[1].slice(0, 5),
	note: '',
}

export const ApplicationDetails = ({ application, onClose, onEdit }: Props) => {

	const [showAddInterview, setShowAddInterview] = useState(false)
	const [interviews, setInterviews] = useState<Interview[]>([])
	const [form, setForm] = useState(emptyForm)
	const [saving, setSaving] = useState(false)
	const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
	const [confirmDeleteInterview, setConfirmDeleteInterview] = useState<Interview | null>(null)

	const statusStyles: Record<Status, string> = {
		Applied: styles.badgeApplied,
		Interview: styles.badgeInterview,
		Offer: styles.badgeOffer,
		Rejected: styles.badgeRejected,
		Ghosted: styles.badgeGhosted,
	}

	const buildCalendarUrl = (interview: Interview, app: Application) => {
		const base = 'https://calendar.google.com/calendar/r/eventedit'
		const text = encodeURIComponent(`${interview.title} — ${app.company}`)
		const details = encodeURIComponent(`Role: ${app.role}\nNote: ${interview.note}`)

		const start = new Date(interview.date)
		const end = new Date(start.getTime() + 60 * 60 * 1000)

		const fmt = (d: Date) =>
			d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

		return `${base}?text=${text}&details=${details}&dates=${fmt(start)}/${fmt(end)}`
	}

	const fetchInterviews = async () => {
		try {
			const data = await interviewService.getInterviews(application.id)
			setInterviews(data)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		fetchInterviews()
	}, [application.id])

	const set = (field: keyof typeof emptyForm, value: string) =>
		setForm(prev => ({ ...prev, [field]: value }))

	const handleAddInterview = async () => {
		if (!form.title.trim() || !form.date) return

		setSaving(true)
		try {
			const datetime = form.time
				? new Date(`${form.date}T${form.time}:00`)
				: new Date(`${form.date}T00:00:00`)

			const interview: Interview = await interviewService.createInterview(
				application.id,
				{
					title: form.title,
					date: datetime,
					note: form.note
				}
			)

			setInterviews(prev => [...prev, interview])
			setForm(emptyForm)
			setShowAddInterview(false)
		} catch (err) {
			console.error(err)
		} finally {
			setSaving(false)
		}
	}

	const handleCancel = () => {
		setForm(emptyForm)
		setShowAddInterview(false)
		setEditingInterview(null)
	}

	const handleEditInterview = async () => {
		if (!editingInterview || !form.title.trim() || !form.date) return

		setSaving(true)
		try {
			const datetime = form.time
				? new Date(`${form.date}T${form.time}:00`)
				: new Date(`${form.date}T00:00:00`)

			const updated = await interviewService.updateInterview(
				application.id,
				editingInterview.id,
				{ title: form.title, date: datetime, note: form.note }
			)

			setInterviews(prev => prev.map(i => i.id === updated.id ? updated : i))
			setEditingInterview(null)
			setForm(emptyForm)
			setShowAddInterview(false)
		} catch (err) {
			console.error(err)
		} finally {
			setSaving(false)
		}
	}

	const handleDeleteInterview = async () => {
		if (!confirmDeleteInterview) return
		try {
			await interviewService.deleteInterview(application.id, confirmDeleteInterview.id)
			setInterviews(prev => prev.filter(i => i.id !== confirmDeleteInterview.id))
			setConfirmDeleteInterview(null)
		} catch (err) {
			console.error(err)
		}
	}

	const handleOpenEdit = (interview: Interview) => {
		setEditingInterview(interview)
		setForm({
			title: interview.title,
			date: new Date(interview.date).toISOString().split('T')[0],
			time: new Date(interview.date).toTimeString().slice(0, 5),
			note: interview.note ?? '',
		})
		setShowAddInterview(true)
	}

	return (
		<>
			<div className={styles.overlay} onClick={onClose} />
			<div className={styles.panel}>

				{/* Panel Header */}
				<div className={styles.panelHeader}>
					<div className={styles.panelCompany}>
						<div>
							<div className={styles.panelCompanyName}>{application.company}</div>
							<div className={styles.panelRole}>{application.role}</div>
						</div>
					</div>
					<div className={styles.panelActions}>
						<button className={styles.panelEditBtn} onClick={onEdit}>
							✏️ Edit
						</button>
						<button className={styles.panelClose} onClick={onClose}>×</button>
					</div>
				</div>

				<div className={styles.panelBody}>

					{/* Details */}
					<div className={styles.panelSection}>
						<p className={styles.panelSectionTitle}>Details</p>
						<div className={styles.panelMeta}>
							<div className={styles.panelMetaItem}>
								<div className={styles.panelMetaLabel}>Status</div>
								<div className={styles.panelMetaValue}>
									<span className={`${styles.badge} ${statusStyles[application.status]}`}>
										<span className={styles.badgeDot} />
										{application.status}
									</span>
								</div>
							</div>
							<div className={styles.panelMetaItem}>
								<div className={styles.panelMetaLabel}>Type</div>
								<div className={styles.panelMetaValue}>{application.type}</div>
							</div>
							<div className={styles.panelMetaItem}>
								<div className={styles.panelMetaLabel}>Location</div>
								<div className={styles.panelMetaValue}>{application.location}</div>
							</div>
							<div className={styles.panelMetaItem}>
								<div className={styles.panelMetaLabel}>Applied</div>
								<div className={styles.panelMetaValue}>{formatDate(application.date.toString())}</div>
							</div>
						</div>
					</div>

					{/* Notes */}
					{application.notes && (
						<div className={styles.panelSection}>
							<p className={styles.panelSectionTitle}>Notes</p>
							<div className={styles.notes}>{application.notes}</div>
						</div>
					)}

					{/* Interviews */}
					<div className={styles.panelSection}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<p className={styles.panelSectionTitle}>Interviews</p>
							<button
								className={styles.actionBtn}
								onClick={() => showAddInterview ? handleCancel() : setShowAddInterview(true)}
							>
								{showAddInterview ? 'Cancel' : '+ Add'}
							</button>
						</div>

						{/* Add interview form */}
						{showAddInterview && (
							<div className={styles.addInterviewForm}>
								<div className={styles.formRow}>
									<label className={styles.formLabel}>Interview Title *</label>
									<input
										className={styles.formInput}
										placeholder="e.g. Technical Screen"
										value={form.title}
										onChange={e => set('title', e.target.value)}
									/>
								</div>
								<div className={styles.formRow2}>
									<div className={styles.formRow}>
										<label className={styles.formLabel}>Date *</label>
										<input
											className={styles.formInput}
											type="date"
											value={form.date}
											onChange={e => set('date', e.target.value)}
										/>
									</div>
									<div className={styles.formRow}>
										<label className={styles.formLabel}>Time</label>
										<input
											className={styles.formInput}
											type="time"
											value={form.time ?? ''}
											onChange={e => set('time', e.target.value)}
										/>
									</div>
								</div>
								<div className={styles.formRow}>
									<label className={styles.formLabel}>Note</label>
									<input
										className={styles.formInput}
										placeholder="e.g. With the hiring manager"
										value={form.note}
										onChange={e => set('note', e.target.value)}
									/>
								</div>
								<button
									className={styles.submitBtn}
									onClick={editingInterview ? handleEditInterview : handleAddInterview}
									disabled={saving}
								>
									{saving ? 'Saving...' : editingInterview ? 'Save Changes' : 'Save Interview'}
								</button>
							</div>
						)}

						{interviews.length > 0 ? (
							<div className={styles.interviewList}>
								{interviews.map(interview => (
									<InterviewCard
										key={interview.id}
										interview={interview}
										application={application}
										buildCalendarUrl={buildCalendarUrl}
										onEdit={handleOpenEdit}
										onDelete={(interview) => setConfirmDeleteInterview(interview)}
									/>
								))}
							</div>
						) : (
							!showAddInterview && (
								<p style={{ fontSize: '13px', color: '#9c9690' }}>No interviews scheduled yet.</p>
							)
						)}
					</div>

				</div>
			</div>

			{confirmDeleteInterview && (
				<ConfirmModal
					title="Delete Interview"
					message={`Are you sure you want to delete "${confirmDeleteInterview.title}"? This cannot be undone.`}
					confirmLabel="Yes, delete"
					onConfirm={handleDeleteInterview}
					onCancel={() => setConfirmDeleteInterview(null)}
				/>
			)}
		</>
	)
}