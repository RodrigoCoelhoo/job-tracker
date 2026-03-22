import { Request, Response, NextFunction } from 'express'
import { applicationBelongsToUser } from '../services/applicationService'

export const requireApplicationOwnership = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const userId = req.user!.id
	const applicationId = req.params.applicationId as string

	const exists = await applicationBelongsToUser(userId, applicationId)
	if (!exists) {
		res.status(404).json({ error: 'Application not found' })
		return
	}

	next()
}