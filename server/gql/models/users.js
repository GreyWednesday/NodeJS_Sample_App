import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { addressQueries } from './addresses';

const { nodeInterface } = getNode();

export const userFields = {
  firstName: { type: GraphQLNonNull(GraphQLString) },
  lastName: { type: GraphQLNonNull(GraphQLString) },
  email: { type: GraphQLNonNull(GraphQLString) },
  password: { type: GraphQLNonNull(GraphQLString) },
  addressId: { type: GraphQLInt }
};

export const userArgs = {
  userId: {
    type: GraphQLInt
  }
};

const User = new GraphQLObjectType({
  name: 'user',
  interfaces: [nodeInterface],
  fields: () => ({
    ...userFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    ...timestamps,
    addresses: {
      ...addressQueries.query,
      resolve: (source, args, context, info) =>
        addressQueries.query.resolve(source, args, { ...context, users: source.dataValues }, info)
    }
  })
});

const UserConnection = createConnection({
  name: 'users',
  target: db.users,
  nodeType: User,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

export { User };

export const userQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: User,
    resolve: resolver(db.users, {
      before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];
        findOptions.where = findOptions.where || {};
        if (context?.bookings?.id) {
          findOptions.where = {
            ...findOptions.where,
            id: context?.bookings?.userId
          };
        }
        return findOptions;
      }
    })
  },
  list: {
    ...UserConnection,
    resolve: UserConnection.resolve,
    type: UserConnection.connectionType,
    args: UserConnection.connectionArgs
  },
  model: db.users
};

export const userMutations = {
  args: userFields,
  type: User,
  model: db.users
};
