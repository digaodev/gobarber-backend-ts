import { Router } from 'express';
import { hash } from 'bcryptjs';
import multer from 'multer';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';

const upload = multer(uploadConfig);

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  const usersRepository = new UsersRepository();

  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService(usersRepository);

    const hashedPassword = await hash(password, 10);

    const newUser = await createUser.execute({
      name,
      email,
      password: hashedPassword,
    });

    delete newUser.password;

    return response.json(newUser);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const updatedUser = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  },
);

export default usersRouter;
