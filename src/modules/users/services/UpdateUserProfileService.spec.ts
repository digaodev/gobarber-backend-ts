import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateUserProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile info for an existing user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const updatedName = 'Jane Upd';
    const updatedEmail = 'janeupd@gmail.com';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUserInfo = {
      user_id: createdUser.id,
      name: updatedName,
      email: updatedEmail,
    };

    const updatedUser = await updateUserProfile.execute(updatedUserInfo);

    expect(updatedUser.name).toBe(updatedName);
    expect(updatedUser.email).toBe(updatedEmail);
  });

  it('should NOT be able to update the email to an already existing user email', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await fakeUsersRepository.create({
      name: 'jane',
      email: 'jane@gmail.com',
      password: '12345',
    });

    await expect(
      updateUserProfile.execute({
        user_id: createdUser.id,
        name: createdUser.name,
        email: 'jane@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password for an existing user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const updatedPassword = 'abcdef';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUserInfo = {
      user_id: createdUser.id,
      name,
      email,
      old_password: password,
      password: updatedPassword,
    };

    const updatedUser = await updateUserProfile.execute(updatedUserInfo);

    expect(updatedUser.password).toBe(updatedPassword);
  });

  it('should NOT be able to update the profile for a non-existing user', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Jonh Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the password without informing the old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const updatedPassword = 'abcdef';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUserInfo = {
      user_id: createdUser.id,
      name,
      email,
      password: updatedPassword,
    };

    await expect(
      updateUserProfile.execute(updatedUserInfo),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the password informing a wrong value for the old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const updatedPassword = 'abcdef';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const updatedUserInfo = {
      user_id: createdUser.id,
      name,
      email,
      old_password: '11111',
      password: updatedPassword,
    };

    await expect(
      updateUserProfile.execute(updatedUserInfo),
    ).rejects.toBeInstanceOf(AppError);
  });
});
