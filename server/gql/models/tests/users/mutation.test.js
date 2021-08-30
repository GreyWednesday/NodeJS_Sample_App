import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Users graphQL-server-DB mutation tests', () => {
  const createUserMut = `
    mutation {
      createUsers (
        firstName: "ABC",
        lastName: "DEF",
        email: "abc@gmail.com",
        password: "werfcdfnrr98h932",
        addressId: 1,
      ) {
        id
        firstName
        lastName
        email
        password
        addressId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new product', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    await getResponse(createUserMut).then(response => {
      const result = get(response, 'body.data.createUsers');
      expect(result).toMatchObject({
        id: "1",
        firstName: "ABC",
        lastName: "DEF",
        email: "abc@gmail.com",
        password: "werfcdfnrr98h932",
        addressId: 1
      });
      done();
    });
  });

  const deleteUserMut = `
  mutation {
    deleteUsers (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a product', async done => {
    await getResponse(deleteUserMut).then(response => {
      const result = get(response, 'body.data.deleteUsers');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
