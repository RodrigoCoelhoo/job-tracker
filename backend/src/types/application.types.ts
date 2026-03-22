export type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted'
export type Type = 'Full-time' | 'Internship' | 'Contract' | 'Part-time'

export interface ApplicationSummary {
	id: string
	company: string
	location: string
	role: string
	type: Type
	date: Date
	status: Status
	notes: string
}

export interface ApplicationForm {
	company: string
	location: string
	role: string
	type: Type
	date: Date
	status: Status
	notes: string
}