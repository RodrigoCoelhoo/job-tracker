import { Router} from 'express'
import * as interviewController from '../controllers/interviewController'
import { requireApplicationOwnership } from '../middlewares/application.middleware';

const router = Router({ mergeParams: true });
router.use('/', requireApplicationOwnership)

router.get('/', interviewController.getApplicationInterviews)
router.post('/', interviewController.createApplicationInterview)
router.put('/:interviewId', interviewController.updateApplicationInterview)
router.delete('/:interviewId', interviewController.deleteApplicationInterview)

export default router;