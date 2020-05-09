import { getRepository } from 'typeorm';

// Models
import User from '../models/User';

// Utils
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      throw new AppError('Email address already exists.');
    }

    const newUser = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(newUser);

    return newUser;
  }
}

export default CreateUserService;
