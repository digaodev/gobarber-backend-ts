import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update a user avatar for an existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';
    const avatarFilename = 'fakeAvatar.jpg';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: createdUser.id,
      avatarFilename,
    });

    expect(createdUser.avatar).toBe(avatarFilename);
  });

  it('should NOT be able to update a user avatar for a non-existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const avatarFilename = 'fakeAvatar.jpg';

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-id',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete an old user avatar when updating with a new one for an existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';
    const avatarFilename = 'fakeAvatar.jpg';
    const avatarFilenameNew = 'fakeAvatarNew.jpg';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await updateUserAvatar.execute({
      user_id: createdUser.id,
      avatarFilename,
    });

    await updateUserAvatar.execute({
      user_id: createdUser.id,
      avatarFilename: avatarFilenameNew,
    });

    expect(deleteFile).toHaveBeenCalledWith(avatarFilename);
    expect(createdUser.avatar).toBe(avatarFilenameNew);
  });
});
