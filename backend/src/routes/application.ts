import { Router } from 'express'
import * as applicationController from '../controllers/applicationController'
import { requireApplicationOwnership } from '../middlewares/application.middleware'
import interviewRoutes from './interview'

const router = Router()

router.get('/stats', applicationController.getStats)
router.get('/', applicationController.getApplications)
router.post('/', applicationController.createApplication)
router.put('/:id', applicationController.updateApplication)
router.delete('/:id', applicationController.deleteApplication)

router.use('/:applicationId/interviews', requireApplicationOwnership, interviewRoutes)

export default router