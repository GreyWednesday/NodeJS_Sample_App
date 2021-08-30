import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Users graphQL-server-DB mutation tests', () => {
  const createBookingMut = `
    mutation {
      createBookings (
      userId: 1
      cabId: 1
      status: "ABC"
      ) {
        id
        userId
        cabId
        status
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new booking', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    await getResponse(createBookingMut).then(response => {
      const result = get(response, 'body.data.createBookings');
      expect(result).toMatchObject({
        id: "1",
        userId: 1,
        cabId: 1,
        status: "ABC"
      });
      done();
    });
  });

  const deleteBookingMut = `
  mutation {
    deleteBookings (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a booking', async done => {
    await getResponse(deleteBookingMut).then(response => {
      const result = get(response, 'body.data.deleteBookings');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
