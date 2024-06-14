import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const user = users.filter((user) => user.email == email)
        return Promise.resolve(user);
      },
      create: (name: string, email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          name,
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const user = await service.register('name', 'email@email.com', 'password');

    console.info(user)

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to create a user with an existing email', async () => {
    await service.register('name', 'email@email.com', 'password');

    await expect(
      service.register('name', 'email@email.com', 'password'),
    ).rejects.toThrow('Email in use');
  });

  it('should fail if user login with invalid email', async () => {
    await expect(service.login('admin@gmail.com','password')).rejects.toThrow(
      'Email Tidak Terdafatar'
    )
  })

  it('should fail if user login with invalid password', async () => {
    await service.register('name', 'email@email.com', 'salah')

    await expect(service.login('email@email.com','password')).rejects.toThrow(
      "Password Tidak Sesuai"
    )
  })

  it('should login a user', async () => {
    await service.register('name', 'email@email.com', 'password') 
    const user = await service.login('email@email.com','password')
    expect(user).toBeDefined()
  })
});
