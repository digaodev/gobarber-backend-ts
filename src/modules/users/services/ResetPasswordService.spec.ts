import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';
    const newPassword = 'abcdef';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    await resetPassword.execute({
      token,
      newPassword,
    });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id);

    expect(updatedUser?.password).toBe(newPassword);
    expect(generateHash).toHaveBeenCalledWith(newPassword);
  });

  it('should NOT be able to reset the password if more than 2 hours has passed', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const password = '123456';
    const newPassword = 'abcdef';

    const createdUser = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    // simulate forwarding time by 3 hours
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        newPassword: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password with invalid token', async () => {
    await expect(
      resetPassword.execute({
        token: 'invalid-token',
        newPassword: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
