import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { uploadImagePipe } from '../../pipes/upload-image.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDataDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      dest: './public/uploads/img/users',
    }),
  )
  signUpUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(uploadImagePipe) profilePicture: Express.Multer.File,
  ) {
    return this.authService.signUp(createUserDto, profilePicture);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signInUser(@Body() userLoginDataDto: UserLoginDataDto) {
    return this.authService.signIn(userLoginDataDto);
  }

  @Post('authorize')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  authorize(@Request() req: Express.Request) {
    const user = req['user'] as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...userInfo } = user;

    return { message: 'Usuario autorizado', ...userInfo };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  refreshToken(@Request() req: Express.Request) {
    const user = req['user'] as JwtPayload;

    return this.authService.refreshToken(user);
  }
}
