import { Router} from 'express'
import * as authController from '../controllers/authController'

const router = Router()

router.get('/google', authController.googleRedirect)
router.get('/callback', authController.googleCallback)
router.get('/me', authController.me)
router.post('/logout', authController.logout)

export default router