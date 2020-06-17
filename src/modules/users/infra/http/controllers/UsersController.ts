import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const createUser = container.resolve(CreateUserService);

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
  }
}

export default UsersController;
