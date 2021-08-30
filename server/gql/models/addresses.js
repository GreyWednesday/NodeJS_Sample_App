import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { userQueries } from './users';
import { cabQueries } from './cabs';
import { bookingQueries } from './bookings';

const { nodeInterface } = getNode();
export const addressFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  address1: { type: GraphQLString },
  address2: { type: GraphQLString },
  city: { type: GraphQLString },
  country: { type: GraphQLString },
  lat: {
    type: GraphQLNonNull(GraphQLFloat)
  },
  long: {
    type: GraphQLNonNull(GraphQLFloat)
  }
};
const Address = new GraphQLObjectType({
  name: 'Address',
  interfaces: [nodeInterface],
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    ...addressFields,
    ...timestamps,
    users: {
      ...userQueries.list,
      resolve: (source, args, context, info) =>
        userQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    },
    cabs: {
      ...cabQueries.list,
      resolve: (source, args, context, info) =>
        cabQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    },
    bookings: {
      ...bookingQueries.list,
      resolve: (source, args, context, info) =>
        bookingQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    }
  })
});

const AddressConnection = createConnection({
  name: 'addresses',
  target: db.addresses,
  nodeType: Address,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.users?.id) {
      findOptions.include.push({
        model: db.users,
        where: {
          id: context.users.id
        }
      });
    }

    if (context?.cabs?.id) {
      findOptions.include.push({
        model: db.cabs,
        where: {
          id: context.cabs.id
        }
      });
    }

    if (context?.bookings?.id) {
      findOptions.include.push({
        model: db.bookings,
        where: {
          id: context.booking.id
        }
      });
    }
    return findOptions;
  },
  ...totalConnectionFields
});

export { AddressConnection, Address };

// queries on the address table
export const addressQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Address,
    resolve: resolver(db.addresses, {
      before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];
        findOptions.where = findOptions.where || {};
        if (context?.users?.id) {
          findOptions.where = {
            ...findOptions.where,
            id: context?.users?.addressId
          };
        }
        if (context?.cabs?.id) {
          findOptions.where = {
            ...findOptions.where,
            id: context?.cabs?.addressId
          };
        }
        return findOptions;
      }
    })
  },
  list: {
    ...AddressConnection,
    resolve: AddressConnection.resolve,
    type: AddressConnection.connectionType,
    args: AddressConnection.connectionArgs
  },
  model: db.addresses
};

export const addressMutations = {
  args: addressFields,
  type: Address,
  model: db.addresses
};
