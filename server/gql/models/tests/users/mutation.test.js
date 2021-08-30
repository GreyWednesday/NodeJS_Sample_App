import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Users graphQL-server-DB mutation tests', () => {
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
