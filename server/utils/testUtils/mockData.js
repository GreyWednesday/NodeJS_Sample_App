import range from 'lodash/range';
import faker from 'faker';
import md5 from 'md5';
const createdBefore = parseInt(Math.random() * 1000);

export const addressesTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  address1: faker.address.streetName(),
  address2: faker.address.streetAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  lat: faker.address.latitude(),
  long: faker.address.longitude()
}));

export const usersTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: md5(faker.internet.password()),
  addressId: (index + 1).toString(),
  createdAt: faker.date.recent(createdBefore)
}));

export const cabsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  name: faker.name.firstName(),
  addressId: (index + 1).toString(),
  bookingId: (index + 1).toString(),
  createdAt: faker.date.recent(createdBefore)
}));

export const bookingsTable = range(1, 10).map((_, index) => ({
  id: (index + 1).toString(),
  userId: (index + 1).toString(),
  createdAt: faker.date.recent(createdBefore),
  cabId: (index + 1).toString(),
  status: faker.commerce.color()
}));

export const DB_ENV = {
  POSTGRES_HOST: 'host',
  POSTGRES_USER: 'user',
  POSTGRES_PASSWORD: 'password',
  POSTGRES_DB: 'table'
};
