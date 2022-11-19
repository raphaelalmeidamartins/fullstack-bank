import * as Sequelize from 'sequelize';
import db from '.';
import Account from './Account';

interface IUser {
  id: number;
  username: string;
  password: string;
  accountId: number;
}

type IUserCreation = Omit<IUser, 'id'>;

type IUserLogin = Omit<IUser, 'id' | 'accountId'>;
type IUserRegister = Omit<IUser, 'id' | 'accountId'>;

type IUserReturned = Omit<IUser, 'password'>;

class User extends Sequelize.Model<IUser, IUserCreation> {
  declare id: number;
  declare username: string;
  declare password: string;
  declare accountId: number;
}

User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    accountId: Sequelize.INTEGER,
  },
  {
    sequelize: db,
    tableName: 'Users',
    timestamps: false,
    underscored: false,
  }
);

User.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account'
});

Account.hasOne(User, {
  sourceKey: 'id',
  foreignKey: 'accountId',
  as: 'user',
});

export default User;
export { IUser, IUserCreation, IUserLogin, IUserRegister, IUserReturned };
