import type { Application } from "../types/application.types";
import type { Interview } from "../types/interview.types";
import styles from './InterviewCard.module.css'

interface Props {
	interview: Interview;
	application: Application;
	buildCalendarUrl: (interview: Interview, app: Application) => string;
	onEdit: (interview: Interview) => void
	onDelete: (interview: Interview) => void
}

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const InterviewCard = ({ interview, application, buildCalendarUrl, onEdit, onDelete }: Props) => {
	return (
		<div className={styles.interviewItem}>

			{/* Left column — info */}
			<div className={styles.interviewInfo}>
				<div className={styles.interviewTitle}>{interview.title}</div>
				<div className={styles.interviewDate}>📅 {formatDate(interview.date.toString())}</div>
				{interview.note && <div className={styles.interviewNote}>{interview.note}</div>}
			</div>

			{/* Right column — actions top, calendar bottom */}
			<div className={styles.rightCol}>
				<div className={styles.titleActions}>
					<button className={styles.iconBtn} onClick={() => onEdit(interview)}>Edit</button>
					<button className={`${styles.iconBtn} ${styles.iconBtnDelete}`} onClick={() => onDelete(interview)}>Delete</button>
				</div>
				<a
					className={styles.calendarBtn}
					href={buildCalendarUrl(interview, application)}
					target="_blank"
					rel="noopener noreferrer"
					onClick={e => e.stopPropagation()}
				>
					📆 Google Cal
				</a>
			</div>

		</div>
	)
}