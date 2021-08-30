import md5 from 'md5';
import { getUserBySignIn, createUserBySignup, getUserById } from '../auth';
import db from '@database/models';

describe('getUserBySign tests', () => {
  const id = 1;
  const email = 'rohansaroha2@wednesday.is';
  const password = 1234;
  const md5Password = md5(password);
  const user = { id: id, email: email, password: md5Password };
  let mock;

  beforeEach(() => {
    mock = jest.spyOn(db.users, 'findOne');
    mock.mockReturnValue(user);
  });

  it('should ensure that it return user when password is correct', async () => {
    const res = await getUserBySignIn(email, password);
    expect(res).toEqual(user);
  });

  it('should ensure that it returns user when supplied with an id', async () => {
    const res = await getUserById(1);
    expect(res).toEqual(user);
  });
});

describe('creatUserBySignup tests', () => {
  it('should ensure it calls correct params to db', async () => {
    const firstName = 'abc';
    const lastName = 'x';
    const email = 'abc@wednesday.is';
    const password = 1234;
    const mock = jest.spyOn(db.users, 'create');
    await createUserBySignup(firstName, lastName, email, password);
    expect(mock).toHaveBeenCalledWith({ firstName, lastName, email, password: md5(password) });
  });
});
