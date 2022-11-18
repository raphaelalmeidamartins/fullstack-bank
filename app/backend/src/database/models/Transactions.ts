import * as Sequelize from 'sequelize';
import db from '.';
import Account from './Account';

interface ITransaction {
  id: number;
  debitedAccountId: number;
  creditedAccountId: number;
  value: number;
  createdAt: Date;
}

type ITransactionCreation = Omit<ITransaction, 'id' | 'createdAt'>;

interface ITransactionRegister {
  username: string;
  value: number;
}

type ITransactionReturned = ITransaction;

class Transaction extends Sequelize.Model<ITransaction, ITransactionCreation> {
  declare id: number;
  declare debitedAccountId: number;
  declare creditedAccountId: number;
  declare value: number;
  declare createdAt: Date;
}

Transaction.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    debitedAccountId: Sequelize.INTEGER,
    creditedAccountId: Sequelize.INTEGER,
    value: Sequelize.FLOAT,
    createdAt: Sequelize.DATE,
  },
  {
    sequelize: db,
    tableName: 'Transactions',
    timestamps: true,
    updatedAt: false,
    underscored: false,
  }
);

Transaction.belongsTo(Account, {
  foreignKey: 'debitedAccountId',
  as: 'debitedAccount',
});

Transaction.belongsTo(Account, {
  foreignKey: 'creditedAccountId',
  as: 'creditedAccount',
});

Account.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'debitedAccountId',
});

Account.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'creditedAccountId',
});

export default Transaction;
export {
  ITransaction,
  ITransactionCreation,
  ITransactionRegister,
  ITransactionReturned,
};
