import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = new Router();

router.post('/', UserController.create);

router.get('/:id', UserController.show);

router.get('/', UserController.index);

router.put('/:id', UserController.update);

router.delete('/:id', UserController.delete);

export default router;
