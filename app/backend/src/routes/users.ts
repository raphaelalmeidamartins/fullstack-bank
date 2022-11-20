import { Router } from 'express';
import 'express-async-errors';
import { userController } from './controllerInstances';

const usersRouter = Router();

usersRouter.post('/login', userController.login);
usersRouter.post('/', userController.register);
usersRouter.get('/balance', userController.getBalance);

export default usersRouter;
