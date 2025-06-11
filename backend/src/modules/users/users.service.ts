import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hashSync } from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    const isPasswordValid = await compare(password, user.hashedPassword);

    return isPasswordValid;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = hashSync(createUserDto.password);

    const existingUser = await this.userModel
      .findOne({
        $or: [
          { email: createUserDto.email.toLowerCase().trim() },
          { username: createUserDto.username.toLowerCase().trim() },
        ],
      })
      .exec();

    if (existingUser) {
      throw new ConflictException(
        'El correo electrónico o el nombre de usuario ya están en uso. Por favor, elige otro.',
      );
    }

    const newUser: User = {
      name: createUserDto.name,
      surname: createUserDto.surname,
      email: createUserDto.email.toLowerCase().trim(),
      username: createUserDto.username.toLowerCase().trim(),
      hashedPassword: hashedPassword,
      birthday: createUserDto.birthdate,
      profile: createUserDto.profile || 'user',
      profilePictureUrl: createUserDto.userProfilePictureUrl,
      bio: createUserDto.bio,
      createdAt: new Date(),
      isActive: true,
    };

    return this.userModel.create(newUser);
  }

  public findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const sanitizedEmailOrUsername = emailOrUsername.toLowerCase().trim();

    const userQuery = this.userModel.findOne({
      $or: [
        { email: sanitizedEmailOrUsername },
        { username: sanitizedEmailOrUsername },
      ],
    });

    return userQuery.exec();
  }
}
