import { Router } from 'express'
import * as applicationController from '../controllers/applicationController'
import { requireApplicationOwnership } from '../middlewares/application.middleware'
import interviewRoutes from './interview'
import { ApplicationFormSchema, GetApplicationsQuerySchema } from '../schemas/application.schemas'
import { validateInput } from '../middlewares/validateInput.middleware'
import { createLimiter } from '../middlewares/ratelimiter.middleware'

const router = Router()

router.get(
	'/stats',
	applicationController.getStats
)

router.get(
	'/',
	validateInput(GetApplicationsQuerySchema, 'query'),
	applicationController.getApplications
)

router.post(
	'/',
	createLimiter,
	validateInput(ApplicationFormSchema),
	applicationController.createApplication
)

router.put(
	'/:id',
	createLimiter,
	validateInput(ApplicationFormSchema),
	applicationController.updateApplication
)

router.delete(
	'/:id',
	createLimiter,
	applicationController.deleteApplication
)

router.use(
	'/:applicationId/interviews',
	requireApplicationOwnership, 
	interviewRoutes
)

export default router