import { Router } from 'express';
import AddressController from '../controllers/AddressController';
import loginIsRequired from '../middlewares/loginIsRequired';

const router = new Router();

router.post('/', loginIsRequired, AddressController.create);

router.get('/:id', loginIsRequired, AddressController.show);

router.get('/', loginIsRequired, AddressController.index);

router.put('/:id', loginIsRequired, AddressController.update);

router.delete('/:id', loginIsRequired, AddressController.delete);

export default router;
