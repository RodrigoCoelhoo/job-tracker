import { Router} from 'express'
import * as applicationController from '../controllers/applicationController'

const router = Router();

router.get('/', applicationController.getApplications)
router.post('/', applicationController.createApplication)
router.put('/:id', applicationController.updateApplication)
router.delete('/:id', applicationController.deleteApplication)

export default router;