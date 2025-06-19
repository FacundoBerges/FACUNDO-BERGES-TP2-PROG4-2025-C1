import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NoContentException } from 'src/exceptions/no-content-exception.exception';
import { SortOptions, SortOrder } from './interfaces/sort-by.type';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument, Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  private readonly logger: Logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  async create(
    userData: JwtPayload,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ) {
    if (image && image.destination && image.filename)
      createPostDto.imageUrl = `${image.destination}/${image.filename}`;

    const newPost = new this.postModel({
      title: createPostDto.title,
      description: createPostDto.description,
      imageUrl: createPostDto.imageUrl,
      author: new Types.ObjectId(userData.sub),
    });

    return await newPost.save();
  }

  async findAll(
    sortBy: SortOptions,
    orderBy: SortOrder,
    offset: number,
    limit: number,
    authorId?: string,
  ): Promise<PostDocument[]> {
    const orderNumber = orderBy === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = orderNumber;
    const authorFilter = authorId
      ? { author: new Types.ObjectId(authorId) }
      : {};

    const { UsersModule } = await import('../users/users.module');
    const { UsersService } = await import('../users/users.service');
    const usersModule = await this.lazyModuleLoader.load(() => UsersModule);
    const usersService = usersModule.get(UsersService);

    if (authorId) await usersService.validateId(authorId);

    const posts = await this.postModel
      .find({ isDeleted: false, ...authorFilter })
      .sort(sortOptions)
      .skip(offset)
      .limit(limit)
      .populate('author', 'username profilePictureUrl')
      .populate('likes', 'username')
      .select('-__v')
      .exec();

    if (!posts || posts.length === 0)
      throw new NoContentException('No se encontraron publicaciones.');

    return posts;
  }

  async findOne(id: string): Promise<PostDocument | null> {
    const objectId = await this.validateId(id);

    return await this.postModel.findById(objectId).select('-__v').exec();
  }

  async remove(userData: JwtPayload, id: string): Promise<void> {
    const objectId = await this.validateId(id);

    const post = await this.postModel.findById(objectId).exec();

    if (
      post?.author.toString() !== userData.sub.toString() &&
      userData.profile !== 'admin'
    ) {
      throw new UnauthorizedException(
        'No tienes permiso para eliminar esta publicación.',
      );
    }

    await post?.updateOne({ isDeleted: true }).exec();
  }

  async likePost(
    userData: JwtPayload,
    id: string,
    isLike: boolean,
  ): Promise<PostDocument | null> {
    const objectId = await this.validateId(id);

    const updateOptions = isLike
      ? { $addToSet: { likes: userData.sub } }
      : { $pull: { likes: userData.sub } };

    return this.postModel
      .findByIdAndUpdate(objectId, updateOptions, { new: true })
      .exec();
  }

  public async updateCommentsCount(
    id: string,
    increment: boolean = true,
  ): Promise<PostDocument | null> {
    const updateValue = increment ? 1 : -1;
    const objectId = await this.validateId(id);

    return await this.postModel
      .findByIdAndUpdate(
        objectId,
        { $inc: { commentsCount: updateValue } },
        { new: true },
      )
      .exec();
  }

  public async validateId(id: string): Promise<Types.ObjectId> {
    if (!id)
      throw new BadRequestException('ID de publicación no proporcionado.');

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('ID de publicación inválido.');

    const objectId = new Types.ObjectId(id);

    const postExists = await this.postModel.exists({
      _id: objectId,
      isDeleted: false,
    });
    if (!postExists) throw new NotFoundException('Publicación no encontrada.');

    return objectId;
  }
}
