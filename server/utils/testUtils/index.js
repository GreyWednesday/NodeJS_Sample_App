import isNil from 'lodash/isNil';
import set from 'lodash/set';
import {
  addressesTable,
  usersTable,
  cabsTable,
  bookingsTable
} from '@server/utils/testUtils/mockData';
import sequelize from 'sequelize';
import request from 'supertest';
import logger from '@middleware/logger/index';

const defineAndAddAttributes = (connection, name, mock, attr, total = 10) => {
  const mockTable = connection.define(name, mock, {
    instanceMethods: {
      findAll: () => [mock],
      findOne: () => mock
    }
  });
  mockTable.rawAttributes = attr;
  mockTable.manyFromSource = { count: () => new Promise(resolve => resolve(total)) };
  set(mockTable, 'sequelize.dialect', 'postgres');
  return mockTable;
};

export const getResponse = async (query, app) => {
  if (!app) {
    app = await require('@server/utils/testUtils/testApp').testApp;
  }
  return await request(app)
    .post('/graphql')
    .type('form')
    .send({ query })
    .set('Accept', 'application/json');
};

export function mockDBClient(config = { total: 10 }) {
  const SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  const dbConnectionMock = new SequelizeMock();
  dbConnectionMock.options = { dialect: 'mock' };

  const addressesMock = defineAndAddAttributes(
    dbConnectionMock,
    'addresses',
    addressesTable[0],
    require('@database/models/addresses').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );
  const usersMock = defineAndAddAttributes(
    dbConnectionMock,
    'users',
    usersTable[0],
    require('@database/models/users').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );
  const cabsMock = defineAndAddAttributes(
    dbConnectionMock,
    'cabs',
    cabsTable[0],
    require('@database/models/cabs').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );
  const bookingsMock = defineAndAddAttributes(
    dbConnectionMock,
    'bookings',
    bookingsTable[0],
    require('@database/models/bookings').getAttributes(sequelize, sequelize.DataTypes),
    config.total
  );

  return {
    client: dbConnectionMock,
    models: {
      addresses: addressesMock,
      users: usersMock,
      cabs: cabsMock,
      bookings: bookingsMock
    }
  };
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    logger().error(error);
  }
}

export const resetAndMockDB = (mockCallback, config, db) => {
  if (!db) {
    db = mockDBClient(config);
  }
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  jest.doMock('@database', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return { getClient: () => db.client, client: db.client, connect: () => {} };
  });
  jest.doMock('@database/models', () => {
    if (mockCallback) {
      mockCallback(db.client, db.models);
    }
    return db.models;
  });
  return db.client;
};
export const createFieldsWithType = fields => {
  const fieldsWithType = [];
  Object.keys(fields).forEach(key => {
    fieldsWithType.push({
      name: key,
      type: {
        name: fields[key].type
      }
    });
  });
  return fieldsWithType;
};

const getExpectedField = (expectedFields, name) => expectedFields.filter(field => field.name === name);

export const expectSameTypeNameOrKind = (result, expected) =>
  result.filter(field => {
    const expectedField = getExpectedField(expected, field.name)[0];
    // @todo check for connection types.
    if (!isNil(expectedField)) {
      return expectedField.type.name === field.type.name || expectedField.type.kind === field.type.kind;
    }
    return false;
  }).length === 0;
