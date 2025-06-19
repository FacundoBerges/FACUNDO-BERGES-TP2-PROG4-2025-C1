import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
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

    return this.userModel
      .create({
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
      })
      .then((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashedPassword, ...response } = user;
        return response;
      });
  }

  public findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const sanitizedEmailOrUsername = emailOrUsername.toLowerCase().trim();

    return this.userModel
      .findOne({
        $or: [
          { email: sanitizedEmailOrUsername },
          { username: sanitizedEmailOrUsername },
        ],
      })
      .exec();
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

  public async changeUserStatus(
    id: string,
    disableUser: boolean = true,
  ): Promise<User> {
    const objectId = await this.validateId(id);
    const user = await this.userModel.findById(objectId).exec();

    if (disableUser && !user?.isActive)
      throw new BadRequestException('El usuario ya está deshabilitado.');

    if (!disableUser && user?.isActive)
      throw new BadRequestException('El usuario ya está habilitado.');

    user!.isActive = !disableUser;

    return user!.save();
  }

  public async validateId(id: string): Promise<Types.ObjectId> {
    if (!id) throw new BadRequestException('ID de usuario no proporcionado.');

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('ID de usuario inválido.');

    const objectId = new Types.ObjectId(id);
    const userExists = await this.userModel.exists({
      _id: objectId,
    });

    if (!userExists) throw new NotFoundException('Usuario no encontrado.');

    return objectId;
  }
}
