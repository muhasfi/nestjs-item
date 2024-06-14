import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  //   find() {
  //     throw new Error('Method not implemented.');
  //   }
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  find(email: string) {
    return this.usersRepository.find({
      where: {
        email,
      },
    });
  }

  create(name: string, email: string, password: string) {
    const user = this.usersRepository.create({ name, email, password });
    return this.usersRepository.save(user);
  }

  findALl() {
    return this.usersRepository.find();
  }

  async findOneBy(id: number) {
    if(!id) {
      throw new NotFoundException('User Not Found')
    }
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneBy(id);
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneBy(id);
    return this.usersRepository.remove(user);
  }
}
