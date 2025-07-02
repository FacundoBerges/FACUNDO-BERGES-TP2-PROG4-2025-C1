import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { AuthGuard } from 'src/guards/auth.guard';
import { uploadImagePipe } from '../../pipes/upload-image.pipe';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserLoginDataDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      dest: './public/uploads/img/users',
    }),
  )
  signUpUser(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile(uploadImagePipe) profilePicture: Express.Multer.File,
  ) {
    return this.authService.signUp(registerUserDto, profilePicture);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signInUser(@Body() userLoginDataDto: UserLoginDataDto) {
    return this.authService.signIn(userLoginDataDto);
  }

  @Post('authorize')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  authorize(@Req() req: Request) {
    const user = req['user'] as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...userInfo } = user;

    return { message: 'Usuario autorizado', ...userInfo };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  refreshToken(@Req() req: Request) {
    const user = req['user'] as JwtPayload;

    return this.authService.refreshToken(user);
  }

  @Get('info')
  findOwnProfile(@Req() req: Request) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.authService.findOwnProfileData(user);
  }
}
