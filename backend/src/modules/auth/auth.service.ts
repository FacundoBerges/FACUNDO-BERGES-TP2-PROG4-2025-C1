import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UserLoginDataDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtResponseDto } from './interfaces/jwt-response-dto.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async signUp(
    createUserDto: CreateUserDto,
    profilePicture?: Express.Multer.File,
  ): Promise<JwtResponseDto> {
    if (
      profilePicture &&
      profilePicture.destination &&
      profilePicture.filename
    ) {
      createUserDto.userProfilePictureUrl = `${profilePicture.destination}/${profilePicture.filename}`;
    }
    const user = await this.usersService.create(createUserDto);

    if (!user) {
      throw new BadRequestException(
        'Error al crear el usuario. Por favor, inténtalo de nuevo.',
      );
    }

    const payload: JwtPayload = this.generateJwtPayload(user);
    const token: string = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  public async signIn(
    userLoginDataDto: UserLoginDataDto,
  ): Promise<JwtResponseDto> {
    const user = await this.usersService.findByEmailOrUsername(
      userLoginDataDto.emailOrUsername,
    );

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isValidPassword = await this.usersService.validatePassword(
      user,
      userLoginDataDto.password,
    );

    if (!isValidPassword)
      throw new BadRequestException('Credenciales inválidas');

    const payload: JwtPayload = this.generateJwtPayload(user);
    const token: string = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  private generateJwtPayload(user: User): JwtPayload {
    return {
      sub: user._id,
      username: user.username,
      profile: user.profile,
      joinDate: user.createdAt,
    };
  }
}
