import { Body, Controller, Get, Post, Session, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dtos';
import { LoginUserDto } from './dtos/login-user.dtos';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interseptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from '../users/user.entity';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private AuthService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() body: CreateUserDto, @Session() sessioin: any) {
    const user = await this.AuthService.register(
      body.name,
      body.email,
      body.password,
    );

    sessioin.userId = user.id;
    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto, @Session() sessioin: any) {
    const user = await this.AuthService.login(body.email, body.password);

    sessioin.userId = user.id;
    return user;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}
