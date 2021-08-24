import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Cabs graphQL-server-DB mutation tests', () => {
  const createCabMut = `
    mutation {
      createCabs (
        name: "ABC",
        addressId: 1,
      ) {
        id
        name
        addressId
        addressId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new cab', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    await getResponse(createCabMut).then(response => {
      const result = get(response, 'body.data.createCabs');
      expect(result).toMatchObject({
        id: "1",
        name: "ABC",
        addressId: 1
      });
      done();
    });
  });

  const deleteCabMut = `
  mutation {
    deleteCabs (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a cab', async done => {
    await getResponse(deleteCabMut).then(response => {
      const result = get(response, 'body.data.deleteCabs');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
