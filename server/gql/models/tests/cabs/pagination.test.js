import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import { cabsTable } from '@server/utils/testUtils/mockData';

describe('Cabs graphQL-server-DB pagination tests', () => {
  const cabsQuery = `
  query {
    cabs (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          name
          addressId
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

  it('should have a query to get the cabs', async done => {
    await getResponse(cabsQuery).then(response => {
      const result = get(response, 'body.data.cabs.edges[0].node');
      expect(result).toEqual({
        id: cabsTable[0].id,
        name: cabsTable[0].name,
        addressId: parseInt(cabsTable[0].addressId)
      });
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    await getResponse(cabsQuery).then(response => {
      const result = get(response, 'body.data.cabs.pageInfo');
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
