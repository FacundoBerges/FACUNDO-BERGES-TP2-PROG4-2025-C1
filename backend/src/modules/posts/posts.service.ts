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

import { NoContentException } from 'src/exceptions/no-content-exception.exception';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument, Post } from './schemas/post.schema';
import { SortOptions, SortOrder } from './interfaces/sort-by.type';

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
    const { UploadsModule } = await import('../uploads/uploads.module');
    const { UploadsService } = await import('../uploads/uploads.service');
    const uploadsModule = await this.lazyModuleLoader.load(() => UploadsModule);
    const uploadsService = uploadsModule.get(UploadsService);

    let imagePath: string | undefined = undefined;
    if (image) imagePath = uploadsService.buildPublicFilePath(image);

    createPostDto.imageUrl = imagePath;
    const newPost = await this.postModel.create({
      title: createPostDto.title,
      description: createPostDto.description,
      imageUrl: createPostDto.imageUrl,
      author: new Types.ObjectId(userData.sub),
    });

    return newPost.populate(
      'author',
      'name surname username profilePictureUrl',
    );
  }

  async findAll(
    sortBy: SortOptions,
    sortOrder: SortOrder,
    offset: number,
    limit: number,
    authorId?: string,
  ) {
    const orderNumber = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = {};
    let authorFilter = {};
    sortOptions[sortBy] = orderNumber;

    if (offset < 0 || limit <= 0)
      throw new BadRequestException(
        'Los parámetros de paginación son inválidos.',
      );

    if (authorId) {
      const usersService = await this.getUsersService();
      const objectId = await usersService.validateId(authorId);
      authorFilter = { author: objectId };
    }

    const posts = await this.postModel
      .aggregate<Post>([
        {
          $match: { isDeleted: false, ...authorFilter },
        },
        {
          $addFields: {
            likesCount: { $size: '$likes' },
          },
        },
        {
          $sort: sortOptions,
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'likes',
            foreignField: '_id',
            as: 'likes',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            imageUrl: 1,
            commentsCount: 1,
            likesCount: 1,
            createdAt: 1,
            updatedAt: 1,
            author: {
              _id: '$author._id',
              name: '$author.name',
              surname: '$author.surname',
              username: '$author.username',
              profilePictureUrl: '$author.profilePictureUrl',
            },
            likes: {
              $map: {
                input: '$likes',
                as: 'like',
                in: {
                  _id: '$$like._id',
                  name: '$$like.name',
                  surname: '$$like.surname',
                  username: '$$like.username',
                  profilePictureUrl: '$$like.profilePictureUrl',
                },
              },
            },
          },
        },
      ])
      .exec();

    if (!posts || posts.length === 0)
      throw new NoContentException('No se encontraron publicaciones.');

    return posts;
  }

  async findOne(id: string): Promise<PostDocument | null> {
    const objectId = await this.validateId(id);

    return await this.postModel
      .findById(objectId)
      .select('-__v')
      .populate('author', 'name surname username profilePictureUrl')
      .populate('likes', 'username')
      .exec();
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
    const post = await this.postModel.findById(objectId).exec();
    const likesStringArray = post?.likes?.map((like) => like.toString());
    const likeInArray = likesStringArray?.includes(userData.sub.toString());

    if (isLike && likeInArray)
      throw new BadRequestException('Ya diste like a esta publicación.');

    if (!isLike && !likeInArray)
      throw new BadRequestException('No has dado like a esta publicación.');

    const updateOptions = isLike
      ? { $addToSet: { likes: userData.sub } }
      : { $pull: { likes: userData.sub } };

    return this.postModel
      .findByIdAndUpdate(objectId, updateOptions, { new: true })
      .select('-__v')
      .populate('author', 'name surname username profilePictureUrl')
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

  private async getUsersService() {
    const { UsersModule } = await import('../users/users.module');
    const { UsersService } = await import('../users/users.service');
    const usersModule = await this.lazyModuleLoader.load(() => UsersModule);

    return usersModule.get(UsersService);
  }
}
