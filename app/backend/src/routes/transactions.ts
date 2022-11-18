import { Router } from 'express';
import 'express-async-errors';
import { transactionController } from './controllerInstances';

const transactionsRouter = Router();

transactionsRouter.post('/', transactionController.register);
transactionsRouter.get('/', transactionController.list);

export default transactionsRouter;
