import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate with an existing user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const createdUser = await createUser.execute({
      name,
      email,
      password,
    });

    const response = await authenticateUserService.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });

  it('should NOT be able to authenticate with a non-existing user', async () => {
    const email = 'johndoe@gmail.com';
    const password = '123456';

    await expect(
      authenticateUserService.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to authenticate with a wrong password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    await createUser.execute({
      name,
      email,
      password,
    });

    await expect(
      authenticateUserService.execute({
        email,
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
