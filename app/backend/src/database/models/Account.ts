import * as Sequelize from 'sequelize';
import db from '.';

interface IAccount {
  id: number;
  balance: number;
}

type IAccountCreation = Omit<IAccount, 'id'>;

type IAccountReturned = IAccount;

class Account extends Sequelize.Model<IAccount, IAccountCreation> {
  declare id: number;
  declare balance: number;
}

Account.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: Sequelize.FLOAT,
  },
  {
    sequelize: db,
    tableName: 'Accounts',
    timestamps: false,
    underscored: false,
  }
);

export default Account;
export { IAccount, IAccountCreation, IAccountReturned };
