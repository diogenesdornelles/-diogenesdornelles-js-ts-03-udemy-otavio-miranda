import { Router } from 'express'
import UserController from '../controllers/UserController'
import loginIsRequired from '../middlewares/loginIsRequired'

const router = new Router()

router.post('/', UserController.create)

router.get('/:id', loginIsRequired, UserController.show)

router.get('/', loginIsRequired, UserController.index)

router.put('/', loginIsRequired, UserController.update)

router.delete('/', loginIsRequired, UserController.delete)

router.post('/reativar/', UserController.reactive)

export default router
