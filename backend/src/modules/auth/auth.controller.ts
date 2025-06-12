import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { uploadImagePipe } from '../../pipes/upload-image.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDataDto } from './dto/login-user.dto';

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
}
