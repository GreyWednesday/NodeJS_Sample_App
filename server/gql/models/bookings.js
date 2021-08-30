import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { addressQueries } from './addresses';
import { userQueries } from './users';
import { cabQueries } from './cabs';

const { nodeInterface } = getNode();

export const bookingFields = {
  userId: { type: GraphQLInt },
  cabId: { type: GraphQLInt },
  status: { type: GraphQLNonNull(GraphQLString) }
};

const Booking = new GraphQLObjectType({
  name: 'booking',
  interfaces: [nodeInterface],
  fields: () => ({
    ...bookingFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    ...timestamps,
    users: {
      ...userQueries.query,
      resolve: (source, args, context, info) =>
        userQueries.query.resolve(source, args, { ...context, bookings: source.dataValues }, info)
    },
    cabs: {
      ...cabQueries.query,
      resolve: (source, args, context, info) =>
        cabQueries.query.resolve(source, args, { ...context, bookings: source.dataValues }, info)
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
