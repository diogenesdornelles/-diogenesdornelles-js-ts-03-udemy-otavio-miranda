import { Router } from 'express'
import EnderecoController from '../controllers/EnderecoController'
import loginIsRequired from '../middlewares/loginIsRequired'

const router = new Router()

router.post('/', loginIsRequired, EnderecoController.create)

router.get('/:id', loginIsRequired, EnderecoController.show)

router.get('/', loginIsRequired, EnderecoController.index)

router.put('/:id', loginIsRequired, EnderecoController.update)

router.delete('/:id', loginIsRequired, EnderecoController.delete)

router.post('/reativar/:id', loginIsRequired, EnderecoController.reactive)

export default router
