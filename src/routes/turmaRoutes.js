import { Router } from 'express'
import TurmaController from '../controllers/TurmaController'
import loginIsRequired from '../middlewares/loginIsRequired'

const router = new Router()

router.post('/', loginIsRequired, TurmaController.create)

router.get('/:id', loginIsRequired, TurmaController.show)

router.get('/', loginIsRequired, TurmaController.index)

router.put('/:id', loginIsRequired, TurmaController.update)

router.delete('/:id', loginIsRequired, TurmaController.delete)

router.post('/reativar/', TurmaController.reactivate)

export default router
