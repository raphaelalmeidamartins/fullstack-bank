import * as Sequelize from 'sequelize';
import db from '.';

interface IUser {
  id: number;
  username: string;
  password: string;
  accountId: number;
}

type IUserCreation = Omit<IUser, 'id'>;

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

export default User;
export { IUser, IUserCreation, IUserReturned };
