import TransactionController from '../controllers/TransactionController';
import UserController from '../controllers/UserController';

const userController = new UserController();
const transactionController = new TransactionController();

export { userController, transactionController };
