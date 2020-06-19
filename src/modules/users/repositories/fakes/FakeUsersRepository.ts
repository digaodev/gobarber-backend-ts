import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === user.id);

    this.users[userIndex] = user;

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.id === id);

    return userFound;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.email === email);

    return userFound;
  }
}

export default UsersRepository;
