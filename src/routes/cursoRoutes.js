import { Router } from 'express'
import CursoController from '../controllers/CursoController'
import loginIsRequired from '../middlewares/loginIsRequired'

const router = new Router()

router.post('/', loginIsRequired, CursoController.create)

router.get('/:id', loginIsRequired, CursoController.show)

router.get('/', loginIsRequired, CursoController.index)

router.put('/:id', loginIsRequired, CursoController.update)

router.delete('/:id', loginIsRequired, CursoController.delete)

router.post('/reativar/', CursoController.reactivate)

export default router
