export type { InterviewForm } from "../schemas/interview.schemas";

export interface Interview {
	id: string
	title: string
	date: Date
	note: string
}