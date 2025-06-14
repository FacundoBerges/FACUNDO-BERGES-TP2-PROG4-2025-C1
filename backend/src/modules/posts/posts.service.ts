import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { NoContentException } from 'src/exceptions/no-content-exception.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument, Post } from './schemas/post.schema';
import { SortBy, OrderBy } from './interfaces/sort-by.type';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(
    userData: JwtPayload,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ): Promise<Post> {
    if (image && image.destination && image.filename)
      createPostDto.contentImageUrl = `${image.destination}/${image.filename}`;

    const newPost: Post = {
      title: createPostDto.title,
      description: createPostDto.content,
      imageUrl: createPostDto.contentImageUrl,
      createdAt: new Date(),
      isDeleted: createPostDto.isDeleted || false,
      author: new mongoose.Types.ObjectId(userData.sub),
    };

    return await this.postModel.create(newPost);
  }

  async findAll(
    sortBy: SortBy,
    orderBy: OrderBy,
    offset: number,
    limit: number,
    authorId?: string,
  ): Promise<Post[]> {
    const orderNumber = orderBy === 'asc' ? 1 : -1;

    const sortOptions = {};
    sortOptions[sortBy] = orderNumber;

    const authorFilter = authorId ? { authorId: authorId } : {};

    const posts = await this.postModel
      .find({ isDeleted: false })
      .where(authorFilter)
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

  async findOne(id: string): Promise<Post | null> {
    await this.validateId(id);

    return await this.postModel.findById(id).exec();
  }

  async remove(userData: JwtPayload, id: string): Promise<void> {
    await this.validateId(id);

    const post = await this.postModel.findById(id).exec();

    if (
      post?.author.toString() === userData.sub ||
      userData.profile === 'admin'
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
  ): Promise<Post | null> {
    await this.validateId(id);

    const updateOptions = isLike
      ? { $addToSet: { likes: userData.sub } }
      : { $pull: { likes: userData.sub } };

    return this.postModel
      .findByIdAndUpdate(id, updateOptions, { new: true })
      .exec();
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new NotFoundException('ID de publicación no proporcionado.');

    const postExists = await this.postModel.exists({
      _id: id,
      isDeleted: false,
    });
    if (!postExists) throw new NotFoundException('Publicación no encontrada.');
  }
}
