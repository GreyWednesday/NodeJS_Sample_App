import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import { bookingsTable } from '@server/utils/testUtils/mockData';

describe('Products graphQL-server-DB pagination tests', () => {
  const usersQuery = `
  query {
    bookings (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          userId
          cabId
          status
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }
`;

  it('should have a query to get the users', async done => {
    await getResponse(usersQuery).then(response => {
      const result = get(response, 'body.data.bookings.edges[0].node');
      expect(result).toEqual({
        id: bookingsTable[0].id,
        userId: parseInt(bookingsTable[0].userId),
        cabId: parseInt(bookingsTable[0].cabId),
        status: bookingsTable[0].status
      });
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    await getResponse(usersQuery).then(response => {
      const result = get(response, 'body.data.bookings.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
      done();
    });
  });
});
