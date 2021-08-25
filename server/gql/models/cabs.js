import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection, resolver } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { addressQueries } from './addresses';
import { userArgs } from './users';

const { nodeInterface } = getNode();

export const cabFields = {
  name: { type: GraphQLNonNull(GraphQLString) },
  addressId: { type: GraphQLInt }
};

const Cab = new GraphQLObjectType({
  name: 'cab',
  interfaces: [nodeInterface],
  fields: () => ({
    ...cabFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    ...timestamps,
    address: {
      ...addressQueries.query,
      resolve: (source, args, context, info) =>
        addressQueries.query.resolve(source, args, { ...context, cabs: source.dataValues }, info)
    }
  })
});

const CabConnection = createConnection({
  name: 'cabs',
  target: db.cabs,
  nodeType: Cab,
  before: async (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    if (args?.userId) {
      const user = await db.users.findOne({
        where: { id: args.userId }
      });
      const currentLocation = user.dataValues.addressId;
      if (args?.where) {
        args.where['addressId'] = currentLocation;
      } else {
        args.where = { addressId: currentLocation };
      }
      findOptions.where = sequelizedWhere(findOptions.where, args.where);
    } else {
      findOptions.where = sequelizedWhere(findOptions.where, args.where);
    }

    return findOptions;
  },
  after: async context => {
    const userId = context.args.userId;
    const cabId = context.edges[0].node.id;
    const status = 'Booked';
    await db.bookings.create({
      userId,
      cabId,
      status
    });
    //console.log(result.dataValues);
    //context.edges[2] = {cursor: context.edges[0].cursor, node: result.dataValues};
    //console.log(context)
    return context;
  },
  ...totalConnectionFields
});

export { Cab };

export const cabQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Cab,
    resolve: resolver(db.cabs, {
      before: (findOptions, args, context) => {
        findOptions.include = findOptions.include || [];
        findOptions.where = findOptions.where || {};
        if (context?.bookings?.id) {
          findOptions.where = {
            ...findOptions.where,
            id: context?.bookings?.cabId
          };
        }
        return findOptions;
      }
    })
  },
  list: {
    ...CabConnection,
    resolve: CabConnection.resolve,
    type: CabConnection.connectionType,
    args: {
      ...CabConnection.connectionArgs,
      ...userArgs
    }
  },
  model: db.cabs
};

export const cabMutations = {
  args: cabFields,
  type: Cab,
  model: db.cabs
};
