import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

describe('CreateUser', () => {
  it('should be able to authenticate with an existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
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

    const response = await authenticateUserService.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });

  it('should NOT be able to authenticate with a non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const email = 'johndoe@gmail.com';
    const password = '123456';

    expect(
      authenticateUserService.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to authenticate with a wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
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
      authenticateUserService.execute({
        email,
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
