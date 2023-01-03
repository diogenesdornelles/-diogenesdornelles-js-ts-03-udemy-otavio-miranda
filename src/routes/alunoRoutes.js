import { Router } from 'express';
import AlunoController from '../controllers/AlunoController';
import loginIsRequired from '../middlewares/loginIsRequired';

const router = new Router();

router.post('/', loginIsRequired, AlunoController.create);

router.get('/:id', loginIsRequired, AlunoController.show);

router.get('/', loginIsRequired, AlunoController.index);

router.put('/:id', loginIsRequired, AlunoController.update);

router.delete('/:id', loginIsRequired, AlunoController.delete);

export default router;
