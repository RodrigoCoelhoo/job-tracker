import { Request, Response } from 'express'
import * as applicationService from '../services/applicationService'
import { ApplicationForm, Status } from '../types/application.types'

export async function getApplications(req: Request, res: Response): Promise<void> {
	const userId = req.user!.id
	const page = parseInt(req.query.page as string) || 1
	const limit = parseInt(req.query.limit as string) || 10
	const status = req.query.status as Status

	try {
		const { applications, pagination } = await applicationService.getApplications(userId, page, limit, status);
		res.status(200).json({ applications, pagination })
	} catch (error) {
		console.error('Error fetching applications:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function createApplication(req: Request, res: Response): Promise<void> {
	const userId = req.user!.id
	const body: ApplicationForm = req.body

	if (!body.company || !body.role || !body.type) {
		res.status(400).json({ error: 'company, role and type are required' })
		return
	}

	try {
		const application = await applicationService.createApplication(userId, body)
		res.status(201).json({ application })
	} catch (error) {
		console.error('Error creating application:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function updateApplication(req: Request, res: Response): Promise<void> {
	const userId = req.user!.id
	const id = req.params.id as string
	const body: ApplicationForm = req.body

	if (!body.company || !body.role || !body.type) {
		res.status(400).json({ error: 'company, role and type are required' })
		return
	}

	try {
		const application = await applicationService.updateApplication(userId, id, body)

		if (!application) {
			res.status(404).json({ error: 'Application not found' })
			return
		}

		res.status(200).json({ application })
	} catch (error) {
		console.error('Error updating application:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function deleteApplication(req: Request, res: Response): Promise<void> {
	const userId = req.user!.id
	const id = req.params.id as string

	try {
		await applicationService.deleteApplication(userId, id)
		res.status(204).send()
	} catch (error) {
		console.error('Error deleting application:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function getStats(req: Request, res: Response): Promise<void> {
	const userId = req.user!.id

	try {
		const stats = await applicationService.getStats(userId)
		res.status(200).json({ stats })
	} catch (error) {
		console.error('Error fetching stats:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}