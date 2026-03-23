import { Router} from 'express'
import * as interviewController from '../controllers/interviewController'

const router = Router({ mergeParams: true });

router.get('/', interviewController.getApplicationInterviews)
router.post('/', interviewController.createApplicationInterview)
router.put('/:interviewId', interviewController.updateApplicationInterview)
router.delete('/:interviewId', interviewController.deleteApplicationInterview)

export default router;