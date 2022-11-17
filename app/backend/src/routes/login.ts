import { Router } from 'express';
import 'express-async-errors';
import { userController } from './controllerInstances';

const loginRouter = Router();

loginRouter.post('/', userController.login);

export default loginRouter;
