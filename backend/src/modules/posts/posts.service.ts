import {
  BadRequestException,
  Injectable,
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
  ) {
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
      .exec();

    if (!posts || posts.length === 0)
      throw new NoContentException('No se encontraron publicaciones.');

    return posts;
  }

  async findOne(id: string) {
    await this.validateId(id);

    return await this.postModel.findById(id).exec();
  }

  async remove(userData: JwtPayload, id: string) {
    await this.validateId(id);

    const post = await this.postModel.findById(id).exec();

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

  async likePost(userData: JwtPayload, id: string, isLike: boolean) {
    await this.validateId(id);

    const updateOptions = isLike
      ? { $addToSet: { likes: userData.sub } }
      : { $pull: { likes: userData.sub } };

    return this.postModel
      .findByIdAndUpdate(id, updateOptions, { new: true })
      .exec();
  }

  public async updateCommentsCount(id: string, increment: boolean = true) {
    const updateValue = increment ? 1 : -1;
    await this.validateId(id);

    return this.postModel
      .findByIdAndUpdate(
        id,
        { $inc: { commentsCount: updateValue } },
        { new: true },
      )
      .exec();
  }

  public async validateId(id: string) {
    if (!id)
      throw new BadRequestException('ID de publicación no proporcionado.');

    const postExists = await this.postModel.exists({
      _id: id,
      isDeleted: false,
    });
    if (!postExists) throw new NotFoundException('Publicación no encontrada.');
  }
}
