import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfile: ShowUserProfileService;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUserProfile = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile info for an existing user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const userProfileInfo = await showUserProfile.execute({
      user_id: createdUser.id,
    });

    expect(userProfileInfo.name).toBe(name);
    expect(userProfileInfo.email).toBe(email);
  });

  it('should NOT be able to show the profile info for a non-existing user', async () => {
    await expect(
      showUserProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
