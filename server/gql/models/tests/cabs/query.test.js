import get from 'lodash/get';
import { addressesTable, bookingsTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Cabs graphQL-server-DB query tests', () => {
  const id = '1';
  const cabQuery = `
  query {
    cab (id: ${id}) {
      id
      name
      addressId
      bookingId
      createdAt
      address {
        id
        country
      }
    }
  }
  `;

  const bookingCabQuery = `
  query{
    cabs(limit: 5, offset: 0, userId: 1) {
      edges {
        cursor
        node {
          id
          addressId
          bookingId
        }
      }
    }
  }
  
  `;

  it('should request for address id related to the user', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.addresses, 'findOne').mockImplementation(() => [addressesTable[0]]);
    await getResponse(cabQuery).then(response => {
      expect(get(response, 'body.data.cab')).toBeTruthy();
      // check if addresses.findOne is being called once
      expect(dbClient.models.addresses.findOne.mock.calls.length).toBe(1);
      // check if addresses.findOne is being called with the correct whereclause
      expect(dbClient.models.addresses.findOne.mock.calls[0][0].where).toEqual({ id: id });
      done();
    });
  });

  it('should book the neareast cab for user', async done => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.bookings, 'create').mockImplementation(() => [bookingsTable[0]]);
    await getResponse(bookingCabQuery).then(response => {
      expect(get(response, 'body.data.cabs.edges[0]')).toBeTruthy();
      expect(get(response, 'body.data.cabs.edges[0].node.bookingId')).toBeTruthy();
      expect(dbClient.models.bookings.create.mock.calls.length).toBe(1);
      expect(dbClient.models.bookings.findOne({ where: { id: response.body.data.cabs.edges[0].node.bookingId } }));
      done();
    });
  });
});
