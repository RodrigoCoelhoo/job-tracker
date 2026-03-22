import { Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import type { ApplicationForm, ApplicationSummary, Status } from '../types/application.types'
import { Page } from '../types/pagination.types'

const VALID_STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']

export const getApplications = async (
	userId: string,
	page: number,
	limit: number,
	status?: Status
): Promise<{
	applications: ApplicationSummary[],
	pagination: Page
}> => {
	const from = (page - 1) * limit
	const to = from + limit - 1

	let query = supabase
		.from('applications')
		.select('*', { count: 'exact' })
		.eq('user_id', userId)
		.order('date', { ascending: false })
		.range(from, to)

	if (status && VALID_STATUSES.includes(status)) {
		query = query.eq('status', status)
	}

	const { data: applications, error, count } = await query

	if (error) throw error

	return {
		applications: applications as ApplicationSummary[],
		pagination: {
			total: count ?? 0,
			page,
			limit,
			totalPages: Math.ceil((count ?? 0) / limit)
		}
	}
}

export const applicationBelongsToUser = async (
	userId: string,
	id: string
): Promise<boolean> => {
	const { data, error } = await supabase
		.from('applications')
		.select('id')
		.eq('id', id)
		.eq('user_id', userId)
		.single()

	if (error) return false
	return !!data
}

export const createApplication = async (
	userId: string,
	body: ApplicationForm
): Promise<ApplicationSummary> => {

	const { data: application, error } = await supabase
		.from('applications')
		.insert({
			user_id: userId,
			company: body.company,
			location: body.location,
			role: body.role,
			type: body.type,
			date: body.date ?? new Date(),
			status: body.status ?? 'Applied',
			notes: body.notes
		})
		.select()
		.single()

	if (error) throw error

	return application as ApplicationSummary;
}

export const updateApplication = async (
	userId: string,
	id: string,
	body: ApplicationForm
): Promise<ApplicationSummary | null> => {
	const { data: application, error } = await supabase
		.from('applications')
		.update({
			company: body.company,
			location: body.location,
			role: body.role,
			type: body.type,
			date: body.date,
			status: body.status,
			notes: body.notes
		})
		.eq('id', id)
		.eq('user_id', userId)
		.select()
		.single()

	if (error) {
		if (error.code === 'PGRST116') return null // not found
		throw error
	}

	return application as ApplicationSummary;
}

export const deleteApplication = async (
	userId: string,
	id: string
): Promise<void> => {
	const { error } = await supabase
		.from('applications')
		.delete()
		.eq('id', id)
		.eq('user_id', userId)

	if (error) throw error
}