export interface Interview {
	id: number
	title: string
	date: string
	note: string
}

export interface Application {
	id: number
	company: string
	location: string
	role: string
	type: Type
	date: string
	status: Status
	notes: string
	interviews: Interview[]
}

export type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted'
export type Type = 'Full-time' | 'Internship' | 'Contract' | 'Part-time'


export interface ApplicationForm {
	company: string
	location: string
	role: string
	type: Type
	date: string
	status: Status
	notes: string
}