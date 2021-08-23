import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getClient } from '../index';

export const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

const sequelize = getClient();

db.addresses = require('@database/models/addresses').model(sequelize, Sequelize.DataTypes);
db.users = require('@database/models/users').model(sequelize, Sequelize.DataTypes);
db.bookings = require('@database/models/bookings').model(sequelize, Sequelize.DataTypes);
db.cabs = require('@database/models/cabs').model(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

export default db;
