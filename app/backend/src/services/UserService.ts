import db from '../database/models';
import Account from '../database/models/Account';
import User from '../database/models/User';

class UserService {
  private _userRepository = User;
  private _accountRepository = Account;

  async register(username: string, password: string): Promise<void> {
    const transaction = await db.transaction();

    try {
      const initialBalance = 100.0;
      const { id: accountId } = await this._accountRepository.create(
        {
          balance: initialBalance,
        },
        { transaction }
      );
      await this._userRepository.create(
        { username, password, accountId },
        { transaction }
      );
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}

export default UserService;
