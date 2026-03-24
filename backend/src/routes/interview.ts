import { Router } from 'express'
import * as interviewController from '../controllers/interviewController'
import { validateInput } from '../middlewares/validateInput.middleware';
import { interviewFormSchema } from '../schemas/interview.schemas';
import { createLimiter } from '../middlewares/ratelimiter.middleware';

const router = Router({ mergeParams: true });

router.get(
	'/',
	interviewController.getApplicationInterviews
)

router.post(
	'/',
	createLimiter,
	validateInput(interviewFormSchema, "body"),
	interviewController.createApplicationInterview
)

router.put(
	'/:interviewId',
	createLimiter,
	validateInput(interviewFormSchema, "body"),
	interviewController.updateApplicationInterview
)

router.delete(
	'/:interviewId',
	createLimiter,
	interviewController.deleteApplicationInterview
)

export default router;