import db from '../database/models';
import Account from '../database/models/Account';
import Token from './strategies/token/Token';
import UserValidator from './strategies/validators/UserValidator';

const UNAVAILABLE_USERNAME_MESSAGE = 'Nome de usuário indisponível, escolha outro';

class UserService {
  private _userRepository = User;
  private _accountRepository = Account;
  private _validator = UserValidator;
  private _tokenModule = Token;

  async register(body: IUserRegister): Promise<void> {
    this._validator.register(body);

    const isUsernameNotAvailable = await this._userRepository.findOne({
      where: { username: body.username },
    });

    if (isUsernameNotAvailable) {
      throw new UnprocessableEntityError(
        UNAVAILABLE_USERNAME_MESSAGE
      );
    }

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
        { ...body, accountId },
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
