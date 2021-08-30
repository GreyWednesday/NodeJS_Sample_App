import get from 'lodash/get';
import { usersTable, cabsTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Bookings graphQL-server-DB query tests', () => {
  const id = '1';
  const bookingQuery = `
  query {
    booking (id: ${id}) {
      id
      userId
      createdAt
      cabId
      status
      startingPoint
      destination
      users {
        id
      }
      cabs {
        id
      }
    }
  }
  `;

  const usersBookingQuery = `
  query{
    bookings(limit: 5, offset: 0, userId: 2) {
      edges {
        cursor
        node {
          id
          userId
          cabId
          startingPoint
          destination
        }
      }
    }
  }
  `;

  it('should request for user id, cabId related to the user', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.users, 'findOne').mockImplementation(() => [usersTable[0]]);
    jest.spyOn(dbClient.models.cabs, 'findOne').mockImplementation(() => [cabsTable[0]]);
    await getResponse(bookingQuery).then(response => {
      expect(get(response, 'body.data.booking')).toBeTruthy();
      // check if users/cabs .findOne is being called once
      expect(dbClient.models.users.findOne.mock.calls.length).toBe(1);
      expect(dbClient.models.cabs.findOne.mock.calls.length).toBe(1);
      // check if users/cabs .findOne is being called with the correct whereclause
      expect(dbClient.models.users.findOne.mock.calls[0][0].where).toEqual({ id: id });
      expect(dbClient.models.cabs.findOne.mock.calls[0][0].where).toEqual({ id: id });

      done();
    });
  });

  it('should display all the bookings of the user', async done => {
    await getResponse(usersBookingQuery).then(response => {
      expect(get(response, 'body.data.bookings.edges[0]')).toBeTruthy();
      expect(get(response, 'body.data.bookings.edges').length).toBe(1);
      expect(get(response, 'body.data.bookings.edges[0].node.userId')).toBe(2);
      done();
    });
  });
});
