import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user.id;

      const showUserProfile = container.resolve(ShowUserProfileService);

      const user = await showUserProfile.execute({
        user_id: userId,
      });

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, old_password } = request.body;

      const userId = request.user.id;

      const UpdateUserProfile = container.resolve(UpdateUserProfileService);

      const updatedUser = await UpdateUserProfile.execute({
        user_id: userId,
        name,
        email,
        password,
        old_password,
      });

      delete updatedUser.password;

      return response.json(updatedUser);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default ProfileController;
