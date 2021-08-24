import get from 'lodash/get';
import { usersTable, cabsTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Booking graphQL-server-DB query tests', () => {
  const id = "1";
  const bookingQuery = `
  query {
    booking (id: ${id}) {
      id
      userId
      createdAt
      cabId
      status
      users {
        id
      }
      cabs {
        id
      }
    }
  }
  `;

  it('should request for user id, cabId related to the user', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.users, 'findOne').mockImplementation(() => [usersTable[0]]);
    jest.spyOn(dbClient.models.cabs, 'findOne').mockImplementation(() => [cabsTable[0]])
    await getResponse(bookingQuery).then(response => {
      expect(get(response, 'body.data.booking')).toBeTruthy();
      // check if users/cabs .findOne is being called once
      expect(dbClient.models.users.findOne.mock.calls.length).toBe(1);
      expect(dbClient.models.cabs.findOne.mock.calls.length).toBe(1);
      // check if users/cabs .findOne is being called with the correct whereclause
      expect(dbClient.models.users.findOne.mock.calls[0][0].where).toEqual({ id: id });
      expect(dbClient.models.cabs.findOne.mock.calls[0][0].where).toEqual({ id: id });
      
      done();
    })
  })
});
