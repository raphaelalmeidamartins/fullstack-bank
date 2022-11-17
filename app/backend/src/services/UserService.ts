import UnauthorizedError from '../utils/errors/UnauthorizedError';
import UnprocessableEntityError from '../utils/errors/UnprocessableEntityError ';
import db from '../database/models';
import Account from '../database/models/Account';
import User, { IUserLogin, IUserRegister } from '../database/models/User';
import Token from './strategies/token/Token';
import UserValidator from './strategies/validators/UserValidator';
import * as bcrypt from 'bcryptjs';

const UNAVAILABLE_USERNAME_MESSAGE =
  'Nome de usuário indisponível, escolha outro';
const UNAUTHORIZED_MESSAGE = 'Nome de usuário ou senha estão incorretos';

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
      throw new UnprocessableEntityError(UNAVAILABLE_USERNAME_MESSAGE);
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

      const hashPassword = await bcrypt.hash(body.password, 10);

      await this._userRepository.create(
        { ...body, password: hashPassword, accountId },
        { transaction }
      );
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async login(
    body: IUserLogin
  ): Promise<{ id: number; username: string; token: string }> {
    this._validator.login(body);

    const user = await this._userRepository.findOne({
      where: { username: body.username },
    });

    if (!user) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);

    const tokenPayload = { id: user.id, username: user.username };
    const token = await this._tokenModule.generate(tokenPayload);

    return { ...tokenPayload, token };
  }
}

export default UserService;
