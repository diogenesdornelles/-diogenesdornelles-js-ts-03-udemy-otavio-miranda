import { Router } from 'express'
import PhotoController from '../controllers/PhotoController'
import loginIsRequired from '../middlewares/loginIsRequired'

const router = new Router()

router.post('', loginIsRequired, PhotoController.store)

router.get('', loginIsRequired, PhotoController.index)

router.put('/:id', loginIsRequired, PhotoController.update)

router.delete('/:id', loginIsRequired, PhotoController.delete)

export default router
