import get from 'lodash/get';
import { usersTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

describe('Products graphQL-server-DB pagination tests', () => {
  const usersQuery = `
  query {
    users (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          firstName
          lastName
          email
          password
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

  it('should have a query to get the users', async done => {
    await getResponse(usersQuery).then(response => {
      const result = get(response, 'body.data.users.edges[0].node');
      expect(result).toEqual({
        id: usersTable[0].id,
        firstName: usersTable[0].firstName,
        lastName: usersTable[0].lastName,
        email: usersTable[0].email,
        password: usersTable[0].password,
        addressId: parseInt(usersTable[0].addressId)
      });
      done();
    });
  });

  it('should have the correct pageInfo', async done => {
    await getResponse(usersQuery).then(response => {
      const result = get(response, 'body.data.users.pageInfo');
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
