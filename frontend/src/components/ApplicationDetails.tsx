import { useState } from "react"
import type { Application, Interview, Status } from "../types/application.types"
import styles from './ApplicationDetails.module.css'
import { InterviewCard } from "./InterviewCard"

type Props = {
	application: Application
	onClose: () => void
	onEdit: () => void
}

export const ApplicationDetails = ({ application, onClose, onEdit }: Props) => {

	const [showAddInterview, setShowAddInterview] = useState(false)

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
		return `${base}?text=${text}&details=${details}`
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
						<button className={styles.panelDeleteBtn}>🗑 Delete</button>
						<button className={styles.panelClose} onClick={onClose}>
							x
						</button>
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
								<div className={styles.panelMetaValue}>{application.date}</div>
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
								onClick={() => setShowAddInterview(v => !v)}
							>
								{showAddInterview ? 'Cancel' : '+ Add'}
							</button>
						</div>

						{/* Add interview form */}
						{showAddInterview && (
							<div className={styles.addInterviewForm}>
								<div className={styles.formRow}>
									<label className={styles.formLabel}>Interview Title</label>
									<input className={styles.formInput} placeholder="e.g. Technical Screen" />
								</div>
								<div className={styles.formRow2}>
									<div className={styles.formRow}>
										<label className={styles.formLabel}>Date</label>
										<input className={styles.formInput} type="date" />
									</div>
									<div className={styles.formRow}>
										<label className={styles.formLabel}>Time</label>
										<input className={styles.formInput} type="time" />
									</div>
								</div>
								<div className={styles.formRow}>
									<label className={styles.formLabel}>Note</label>
									<input className={styles.formInput} placeholder="e.g. With the hiring manager" />
								</div>
								<button className={styles.submitBtn}>Save Interview</button>
							</div>
						)}

						{application.interviews.length > 0 ? (
							<div className={styles.interviewList}>
								{application.interviews.map(interview => (
									<InterviewCard
										interview={interview}
										application={application}
										buildCalendarUrl={buildCalendarUrl}
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
		</>
	)
}