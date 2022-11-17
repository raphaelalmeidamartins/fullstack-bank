import { Router } from 'express';
import 'express-async-errors';
import { userController } from './controllerInstances';

const usersRouter = Router();

usersRouter.post('/', userController.register);

export default usersRouter;
