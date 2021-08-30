import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import upperFirst from 'lodash/upperFirst';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { addressMutations } from '@gql/models/addresses';
import { userMutations } from '@gql/models/users';
import { MUTATION_TYPE, SUBSCRIPTION_TOPICS } from '@utils/constants';
import { bookingMutations } from './models/bookings';
import { cabMutations } from './models/cabs';
import { scheduleJob } from './custom/scheduleJobMutation';
import { pubsub } from '@utils/pubsub';

const shouldNotAddMutation = (type, table) => {
  if (type === MUTATION_TYPE.CREATE) {
    const negateTablesList = ['users'];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.UPDATE) {
    const negateTablesList = [];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.DELETE) {
    const negateTablesList = [];
    return !negateTablesList.includes(table);
  }
};

export const createResolvers = model => ({
  createResolver: async (parent, args, context, resolveInfo) => {
    const result = await model.create(args);
    if (resolveInfo.fieldName === 'createBookings') {
      pubsub.publish(SUBSCRIPTION_TOPICS.BOOKINGS, {
        bookingsCreated: {
          id: result.dataValues.id,
          userId: args.userId,
          cabId: args.cabId,
          startingPoint: args.startingPoint,
          destination: args.destination,
          status: args.status
        }
      });
    }
    return result;
  },
  updateResolver: (parent, args, context, resolveInfo) => updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) => deleteUsingId(model, args)
});

export const DB_TABLES = {
  address: addressMutations,
  users: userMutations,
  bookings: bookingMutations,
  cabs: cabMutations
};

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach(table => {
    const { id, ...createArgs } = DB_TABLES[table].args;

    if (shouldNotAddMutation(MUTATION_TYPE.CREATE, table)) {
      mutations[`create${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        args: createArgs,
        resolve: createResolvers(DB_TABLES[table].model).createResolver
      };
    }

    if (shouldNotAddMutation(MUTATION_TYPE.UPDATE, table)) {
      mutations[`update${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        resolve: createResolvers(DB_TABLES[table].model).updateResolver
      };
    }

    if (shouldNotAddMutation(MUTATION_TYPE.DELETE, table)) {
      mutations[`delete${upperFirst(table)}`] = {
        type: deletedId,
        args: {
          id: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: createResolvers(DB_TABLES[table].model).deleteResolver
      };
    }
  });
  mutations.scheduleJob = scheduleJob;

  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
