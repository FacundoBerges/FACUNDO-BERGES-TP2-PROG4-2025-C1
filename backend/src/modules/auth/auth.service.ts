import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtResponseDto } from './interfaces/jwt-response-dto.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserLoginDataDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  public async signUp(
    registerUserDto: RegisterUserDto,
    profilePicture?: Express.Multer.File,
  ): Promise<JwtResponseDto> {
    const { UploadsModule } = await import('../uploads/uploads.module');
    const { UploadsService } = await import('../uploads/uploads.service');
    const uploadsModule = await this.lazyModuleLoader.load(() => UploadsModule);
    const uploadsService = uploadsModule.get(UploadsService);

    let imagePath: string | undefined = undefined;
    if (profilePicture)
      imagePath = uploadsService.buildPublicFilePath(profilePicture);

    registerUserDto.userProfilePictureUrl = imagePath;

    const user = await this.usersService.create(registerUserDto);
    const payload: JwtPayload = this.generateJwtPayload(user);
    const token: string = await this.jwtService.signAsync(payload);

    return { accessToken: token };
  }

  public async signIn(
    userLoginDataDto: UserLoginDataDto,
  ): Promise<JwtResponseDto> {
    console.log('userLoginDataDto', userLoginDataDto);

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

  public async refreshToken(userData: JwtPayload): Promise<JwtResponseDto> {
    if (!userData) throw new UnauthorizedException('Usuario no autorizado.');

    const token: string = await this.jwtService.signAsync({ ...userData });

    return { accessToken: token };
  }

  private generateJwtPayload(
    user: User | Omit<User, 'hashedPassword'>,
  ): JwtPayload {
    return {
      sub: user._id,
      name: user.name,
      surname: user.surname,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      profile: user.profile,
      birthday: user.birthday,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: user?.createdAt,
    };
  }
}
