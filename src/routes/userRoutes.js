import { Router } from 'express';
import UserController from '../controllers/UserController';
import loginIsRequired from '../middlewares/loginIsRequired';

const router = new Router();

router.post('/', UserController.create);

router.get('/', loginIsRequired, UserController.show);

router.get('/', loginIsRequired, UserController.index);

router.put('/', loginIsRequired, UserController.update);

router.delete('/', loginIsRequired, UserController.delete);

export default router;
