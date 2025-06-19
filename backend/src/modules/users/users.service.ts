import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { NoContentException } from 'src/exceptions/no-content-exception.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10);

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

    const profileType: string = createUserDto?.profile || 'user';
    const newUser = new this.userModel({
      name: createUserDto.name,
      surname: createUserDto.surname,
      email: createUserDto.email.toLowerCase().trim(),
      username: createUserDto.username.toLowerCase().trim(),
      hashedPassword: hashedPassword,
      birthday: createUserDto.birthday,
      profile: profileType,
      profilePictureUrl: createUserDto.userProfilePictureUrl,
      bio: createUserDto.bio,
      isActive: true,
    });

    return newUser.save();
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

  public async findAll() {
    const users = await this.userModel
      .find()
      .select('-hashedPassword -__v')
      .exec();

    if (!users || users.length === 0)
      throw new NoContentException('No se encontraron usuarios activos.');

    return users;
  }

  public async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    const isPasswordValid = await compare(password, user.hashedPassword);

    return isPasswordValid;
  }

  public async changeUserStatus(id: string, disableUser = true): Promise<User> {
    await this.validateId(id);

    const user = await this.userModel.findById(id).exec();

    user!.isActive = !disableUser;

    return user!.save();
  }

  public async validateId(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID de usuario no proporcionado.');

    const userExists = await this.userModel.exists({ _id: id, isActive: true });
    if (!userExists) throw new NotFoundException('Usuario no encontrado.');
  }
}
