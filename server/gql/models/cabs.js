import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';

const { nodeInterface } = getNode();

export const cabFields = {
  name: { type: GraphQLNonNull(GraphQLString) },
};

const Cab = new GraphQLObjectType({
  name: 'Cab',
  interfaces: [nodeInterface],
  fields: () => ({
    ...cabFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    addressId: { type: GraphQLInt},
    ...timestamps
  })
});

const CabConnection = createConnection({
  name: 'cabs',
  target: db.cabs,
  nodeType: Cab,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
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
    type: Cab
  },
  list: {
    ...CabConnection,
    resolve: CabConnection.resolve,
    type: CabConnection.connectionType,
    args: CabConnection.connectionArgs
  },
  model: db.cabs
};

export const cabMutations = {
  args: cabFields,
  type: Cab,
  model: db.cabs
};
