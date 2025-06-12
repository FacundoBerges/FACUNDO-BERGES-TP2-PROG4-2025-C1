import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NoContentException } from 'src/exceptions/no-content-exception.exception';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDocument, Post } from './schemas/post.schema';
import { SortBy, OrderBy } from './interfaces/sort-by.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(
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
      authorId: createPostDto.authorId,
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
      .populate('authorId', 'username profilePictureUrl')
      .exec();

    if (!posts || posts.length === 0)
      throw new NoContentException('No se encontraron publicaciones.');

    return posts;
  }

  async findOne(id: string): Promise<Post | null> {
    await this.validateId(id);

    return await this.postModel.findById(id).exec();
  }

  async remove(id: string): Promise<Post | null> {
    await this.validateId(id);

    return this.postModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
      })
      .exec();
  }

  async likePost(id: string, isLike: boolean): Promise<Post | null> {
    await this.validateId(id);
    const value: 1 | -1 = isLike ? 1 : -1;

    return this.postModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { likesCount: value },
        },
        { new: true },
      )
      .exec();
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new NotFoundException('ID de publicación no proporcionado.');

    const postExists = await this.postModel.exists({ _id: id });
    if (!postExists) throw new NotFoundException('Publicación no encontrada.');
  }
}
