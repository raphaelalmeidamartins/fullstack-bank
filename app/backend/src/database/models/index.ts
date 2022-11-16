import { Model, Sequelize } from 'sequelize';
import * as config from '../config/database';

const db = new Sequelize(config);

export default db;
