import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const createdUser = await createUser.execute({
      name,
      email,
      password,
    });

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(name);
  });

  it('should NOT be able to create two users with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const createdUser = await createUser.execute({
      name,
      email,
      password,
    });

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(name);

    expect(
      createUser.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
