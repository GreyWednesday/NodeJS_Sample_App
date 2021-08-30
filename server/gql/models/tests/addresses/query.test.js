import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { storesTable, suppliersTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB query tests', () => {
  const id = 1;
  const addressQuery = `
  query {
    address (id: ${id}) {
      id
      address1
    }
  }
  `;

  it('should be able to query the database', async done => {

    await getResponse(addressQuery).then(response => {
      expect(get(response, 'body.data.address')).toBeTruthy();
      done();
    });
  });
});
