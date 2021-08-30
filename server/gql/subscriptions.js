import { GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { pubsub } from '@utils/pubsub';
import { SUBSCRIPTION_TOPICS } from '@utils/constants';
import { withFilter } from 'graphql-subscriptions';

export const SubscriptionRoot = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    notifications: {
      type: new GraphQLObjectType({
        name: 'ScheduleJobSubscription',
        fields: () => ({
          message: {
            type: GraphQLNonNull(GraphQLString)
          },
          scheduleIn: {
            type: GraphQLNonNull(GraphQLInt)
          }
        })
      }),
      subscribe: (_, args) => pubsub.asyncIterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS)
    },
    bookingsCreated: {
      type: new GraphQLObjectType({
        name: 'GetNewBookings',
        fields: () => ({
          id: {
            type: GraphQLNonNull(GraphQLInt)
          },
          userId: {
            type: GraphQLNonNull(GraphQLInt)
          },
          cabId: {
            type: GraphQLNonNull(GraphQLInt)
          },
          startingPoint: {
            type: GraphQLNonNull(GraphQLInt)
          },
          destination: {
            type: GraphQLNonNull(GraphQLInt)
          },
          status: {
            type: GraphQLNonNull(GraphQLString)
          },
          createdAt: {
            type: GraphQLDateTime
          }
        })
      }),
      args: {
        cabId: {
          type: GraphQLNonNull(GraphQLInt)
        }
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(SUBSCRIPTION_TOPICS.BOOKINGS),
        (payload, variables) => payload.bookingsCreated.cabId === variables.cabId
      )
    }
  }
});
