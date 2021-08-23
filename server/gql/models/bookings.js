import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { addressQueries } from './addresses';

const { nodeInterface } = getNode();

export const bookingFields = {
  status: { type: GraphQLNonNull(GraphQLString) }
};

const Booking = new GraphQLObjectType({
  name: 'Booking',
  interfaces: [nodeInterface],
  fields: () => ({
    ...bookingFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    userId: { type: GraphQLInt },
    cabId: { type: GraphQLInt },
    email: { type: GraphQLNonNull(GraphQLString) },
    addressId: { type: GraphQLInt },
    ...timestamps,
    addresses: {
      ...addressQueries.list,
      resolve: (source, args, context, info) =>
      addressQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    }
  })
});

const BookingConnection = createConnection({
  name: 'bookings',
  target: db.bookings,
  nodeType: Booking,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

export { Booking };

export const bookingQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Booking
  },
  list: {
    ...BookingConnection,
    resolve: BookingConnection.resolve,
    type: BookingConnection.connectionType,
    args: BookingConnection.connectionArgs
  },
  model: db.bookings
};

export const bookingMutations = {
  args: bookingFields,
  type: Booking,
  model: db.bookings
};
