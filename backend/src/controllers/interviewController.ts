import { Request, Response } from 'express'
import * as interviewService from '../services/interviewService'
import { InterviewForm } from '../types/interview.types'

export async function getApplicationInterviews(req: Request, res: Response): Promise<void> {
	const id = req.params.applicationId as string

	try {
		const interviews = await interviewService.getInterviewsByApplicationId(id)
		res.status(200).json({ interviews })
	} catch (error) {
		console.error('Error fetching interviews:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function createApplicationInterview(req: Request, res: Response): Promise<void> {
	const applicationId = req.params.applicationId as string
	const body: InterviewForm = req.body

	if (!body.title || !body.date) {
		res.status(400).json({ error: 'title and date are required' })
		return
	}

	try {
		const interview = await interviewService.createApplicationInterview(applicationId, body)
		res.status(201).json({ interview })
	} catch (error) {
		console.error('Error creating interview:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function updateApplicationInterview(req: Request, res: Response): Promise<void> {
	const interviewId = req.params.interviewId as string
	const body: InterviewForm = req.body

	if (!body.title || !body.date) {
		res.status(400).json({ error: 'title and date are required' })
		return
	}

	try {
		const interview = await interviewService.updateApplicationInterview(interviewId, body)
		res.status(200).json({ interview })
	} catch (error) {
		console.error('Error updating interview:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export async function deleteApplicationInterview(req: Request, res: Response): Promise<void> {
	const interviewId = req.params.interviewId as string

	try {
		await interviewService.deleteApplicationInterview(interviewId)
		res.status(204).send()
	} catch (error) {
		console.error('Error deleting interview:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}