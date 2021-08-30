import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultListArgs, defaultArgs, resolver } from 'graphql-sequelize';
import { Aggregate } from '@gql/models/aggregate';
import { getNode } from '@gql/node';
import { addressQueries } from '@gql/models/addresses';
import { User, userQueries } from '@gql/models/users';
import { bookingQueries } from '@gql/models/bookings';
import { cabQueries } from '@gql/models/cabs';

const { nodeField, nodeTypeMapper } = getNode();

const DB_TABLES = {
  address: addressQueries,
  user: userQueries,
  booking: bookingQueries,
  cab: cabQueries
};

export const addQueries = () => {
  const query = {
    aggregate: Aggregate
  };
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      resolve: resolver(DB_TABLES[table].model),
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };
    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list,
      args: {
        ...DB_TABLES[table].list?.args,
        ...defaultListArgs(DB_TABLES[table].model),
        limit: { type: GraphQLNonNull(GraphQLInt) },
        offset: { type: GraphQLNonNull(GraphQLInt) }
      }
    };
  });
  return query;
};

nodeTypeMapper.mapTypes({
  users: User
});
export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  node: nodeField,
  fields: () => ({
    ...addQueries(),
    aggregate: Aggregate
  })
});
