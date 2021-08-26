import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Bookings graphQL-server-DB mutation tests', () => {
  const createBookingMut = `
    mutation {
      createBookings (
      userId: 1
      cabId: 1
      status: "ABC"
      startingPoint: 123
      destination: 234
      ) {
        id
        userId
        cabId
        status
        startingPoint
        destination
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
        status: "ABC",
        startingPoint: 123,
        destination: 234
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
