import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SortOptions, SortOrder } from '../interfaces/sort-by.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  async create(
    userData: JwtPayload,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const postsService = await this.getPostsService();
    await postsService.validateId(postId);

    const newComment = await this.commentModel.create({
      content: createCommentDto.content,
      author: new mongoose.Types.ObjectId(userData.sub),
      post: new mongoose.Types.ObjectId(postId),
    });

    await postsService.updateCommentsCount(postId);

    return newComment;
  }

  async findAll(
    postId: string,
    offset: number = 0,
    limit: number = 10,
    sortBy: SortOptions = 'createdAt',
    orderBy: SortOrder = 'desc',
  ) {
    const postsService = await this.getPostsService();
    await postsService.validateId(postId);

    return await this.commentModel
      .find({ post: new mongoose.Types.ObjectId(postId) })
      .populate('author', 'username profilePictureUrl')
      .sort({ [sortBy]: orderBy })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async update(
    userData: JwtPayload,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.validateCommentOwnership(userData, commentId);

    return await this.commentModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(commentId),
      { content: updateCommentDto.content },
      { new: true },
    );
  }

  async remove(id: string) {
    await this.validateId(id);

    const comment = await this.commentModel
      .findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        { isDeleted: true },
        { new: true },
      )
      .exec();

    if (!comment!.isDeleted)
      throw new BadRequestException('El comentario no se pudo eliminar');

    const postsService = await this.getPostsService();
    await postsService.updateCommentsCount(comment!.post._id.toString(), false);
  }

  async validateCommentOwnership(userData: JwtPayload, commentId: string) {
    await this.validateId(commentId);

    const comment = await this.commentModel
      .findById(commentId)
      .select('author')
      .exec();

    if (comment?.author._id.toString() !== userData.sub?.toString())
      throw new UnauthorizedException(
        'No tienes permiso para actualizar este comentario.',
      );
  }

  async validateId(id: string) {
    if (!id) throw new BadRequestException('El ID es requerido');

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID no es válido');

    if (!(await this.commentModel.exists({ _id: id, isDeleted: false })))
      throw new NotFoundException('El comentario no existe');
  }

  private async getPostsService() {
    const { PostsModule } = await import('../posts.module');
    const { PostsService } = await import('../posts.service');
    const postModule = await this.lazyModuleLoader.load(() => PostsModule);
    const postsService = postModule.get(PostsService);

    return postsService;
  }
}
