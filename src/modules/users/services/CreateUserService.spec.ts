import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
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

    await expect(
      createUser.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
