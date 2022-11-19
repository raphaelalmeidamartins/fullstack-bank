import { Op } from 'sequelize';
import db from '../database/models';
import Account from '../database/models/Account';
import Transaction, {
  ITransaction,
  ITransactionRegister
} from '../database/models/Transactions';
import User from '../database/models/User';
import NotFoundError from '../utils/errors/NotFoundError';
import UnprocessableEntityError from '../utils/errors/UnprocessableEntityError ';
import Token from './strategies/token/Token';
import TransactionValidator from './strategies/validators/TransactionValidator';

const INCLUDE_OPTIONS = {
  attributes: { exclude: ['debitedAccountId', 'creditedAccountId'] },
  include: [
    {
      model: Account,
      as: 'debitedAccount',
      attributes: ['id'],
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
    },
    {
      model: Account,
      as: 'creditedAccount',
      attributes: ['id'],
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
    },
  ],
};
class TransactionService {
  private _repository = Transaction;
  private _userRepository = User;
  private _accountRepository = Account;
  private _validator = TransactionValidator;
  private _tokenModule = Token;

  async register(
    authorization: string | undefined,
    body: ITransactionRegister
  ): Promise<void> {
    this._validator.register(body);

    const { id } = await this._tokenModule.validate(authorization);

    const debitedUser = await this._userRepository.findByPk(id);
    const debitedAccount = await this._accountRepository.findByPk(
      debitedUser?.accountId
    );
    const creditedUser = await this._userRepository.findOne({
      where: { username: body.username },
    });
    const creditedAccount = await this._accountRepository.findByPk(
      creditedUser?.accountId
    );

    if (!debitedAccount || !creditedAccount)
      throw new NotFoundError(
        'Dados de transação inválidos, verifique se o nome de usuário está correto.'
      );

    if (debitedAccount.balance < body.value) {
      throw new UnprocessableEntityError(
        'Você não tem saldo suficiente para realizar esta transação.'
      );
    }

    if (debitedAccount.id === creditedAccount.id) {
      throw new UnprocessableEntityError(
        'Não é possível fazer uma transação para a mesma conta.'
      );
    }

    const transaction = await db.transaction();

    try {
      await this._repository.create(
        {
          debitedAccountId: id,
          creditedAccountId: creditedAccount.id,
          value: body.value,
        },
        { transaction }
      );

      await debitedAccount.update(
        { balance: debitedAccount.balance - body.value },
        { transaction }
      );
      await creditedAccount.update(
        { balance: creditedAccount.balance + body.value },
        { transaction }
      );

      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }

  async list(
    authorization: string | undefined,
    type: string | undefined,
    from: string | undefined,
    to: string | undefined
  ): Promise<ITransaction[]> {
    const { id } = await this._tokenModule.validate(authorization);

    let transactions: ITransaction[];
    let dateQuery = {};

    if (from) {
      const startDate = new Date(from);
      const endDate = to ? new Date(to) : new Date();
      dateQuery = { createdAt: { [Op.between]: [startDate, endDate] } };
    }

    switch (type) {
      case 'cashout':
        transactions = await this._repository.findAll({
          order: [['createdAt', 'DESC']],
          where: { debitedAccountId: id, ...dateQuery },
          ...INCLUDE_OPTIONS,
        });
        break;

      case 'cashin':
        transactions = await this._repository.findAll({
          order: [['createdAt', 'DESC']],
          where: { creditedAccountId: id, ...dateQuery },
          ...INCLUDE_OPTIONS,
        });
        break;

      default:
        transactions = await this._repository.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            [Op.or]: [{ debitedAccountId: id }, { creditedAccountId: id }],
            ...dateQuery,
          },
          ...INCLUDE_OPTIONS,
        });
        break;
    }

    return transactions;
  }
}

export default TransactionService;
