export type { ApplicationForm, Status, Type } from "../schemas/application.schemas";
import { Status, Type } from "../schemas/application.schemas";

export interface Application {
	id: string
	company: string
	location: string
	role: string
	type: Type
	date: Date
	status: Status
	notes: string
}

export interface ApplicationStats {
	total: number,
	interviews: number,
	offers: number,
	rejections: number,
}