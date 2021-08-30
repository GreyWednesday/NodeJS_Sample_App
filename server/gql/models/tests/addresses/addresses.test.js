import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { addressFields } from '@gql/models/addresses';
import { timestamps } from '@gql/models/timestamps';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...addressFields, ...timestamps });

const query = `
  {
    __type(name: "Address") {
        name
        kind
        fields {
          name
          type {
            name
            kind
          }
        }
      }    
  }
`;
describe('Address introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(addressFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have an users connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressesFieldTypes = get(result, 'data.__type.fields');
    const addressesField = addressesFieldTypes.find(field => field.name === 'users');
    expect(addressesField.type.kind).toBe('OBJECT');
    expect(addressesField.type.name).toBe('usersConnection');
  });
  it('should have an cabs connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressesFieldTypes = get(result, 'data.__type.fields');
    const addressesField = addressesFieldTypes.find(field => field.name === 'cabs');
    expect(addressesField.type.kind).toBe('OBJECT');
    expect(addressesField.type.name).toBe('cabsConnection');
  });
  it('should have a bookings connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressesFieldTypes = get(result, 'data.__type.fields');
    const addressesField = addressesFieldTypes.find(field => field.name === 'bookings');
    expect(addressesField.type.kind).toBe('OBJECT');
    expect(addressesField.type.name).toBe('bookingsConnection');
  });
});
