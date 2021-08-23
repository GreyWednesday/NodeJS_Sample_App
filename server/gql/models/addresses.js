import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';

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
  })
});

const AddressConnection = createConnection({
  name: 'addresses',
  target: db.addresses,
  nodeType: Address,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.supplier?.id) {
      findOptions.include.push({
        model: db.users,
        where: {
          id: context.users.id
        }
      });
    }

    if (context?.store?.id) {
      findOptions.include.push({
        model: db.cabs,
        where: {
          id: context.cabs.id
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
    type: Address
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
