import type { Application, Interview } from "../types/application.types";
import styles from './InterviewCard.module.css'

interface Props {
	interview : Interview;
	application: Application;
	buildCalendarUrl : (interview: Interview, app: Application) => string;
}

export const InterviewCard = ({ interview, application, buildCalendarUrl }: Props) => {
	return (
		<div key={interview.id} className={styles.interviewItem}>
			<div className={styles.interviewInfo}>
				<div className={styles.interviewTitle}>{interview.title}</div>
				<div className={styles.interviewDate}>📅 {interview.date}</div>
				<div className={styles.interviewNote}>{interview.note}</div>
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
	)
}