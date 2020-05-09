import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

// Models
import User from '../models/User';

// Utils
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new AppError(
        'Only authenticated users can update the avatar.',
        401,
      );
    }

    if (user.avatar) {
      // Delete previous avatar file
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // update the current user instance
    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
