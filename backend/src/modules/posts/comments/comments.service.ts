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
    const postObjectId = await postsService.validateId(postId);

    return await this.commentModel
      .find({ post: postObjectId, isDeleted: false })
      .populate('author', 'name surname username profilePictureUrl')
      .sort({ [sortBy]: orderBy })
      .skip(offset)
      .limit(limit)
      .select('-__v -isDeleted -post')
      .exec();
  }

  async update(
    userData: JwtPayload,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const objectId = await this.validateCommentOwnership(userData, commentId);

    return await this.commentModel
      .findByIdAndUpdate(
        objectId,
        { content: updateCommentDto.content },
        { new: true },
      )
      .select('-__v -isDeleted');
  }

  async remove(id: string) {
    const objectId = await this.validateId(id);
    const comment = await this.commentModel
      .findByIdAndUpdate(objectId, { isDeleted: true }, { new: true })
      .exec();

    if (!comment!.isDeleted)
      throw new BadRequestException('El comentario no se pudo eliminar');

    const postsService = await this.getPostsService();
    await postsService.updateCommentsCount(comment!.post._id.toString(), false);
  }

  async validateCommentOwnership(userData: JwtPayload, commentId: string) {
    const objectId = await this.validateId(commentId);

    const comment = await this.commentModel
      .findById(objectId)
      .select('author')
      .exec();

    if (comment?.author._id.toString() !== userData.sub?.toString())
      throw new UnauthorizedException(
        'No tienes permiso para actualizar este comentario.',
      );

    return objectId;
  }

  async validateId(id: string) {
    if (!id) throw new BadRequestException('El ID es requerido');

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID no es válido');

    const objectId = new mongoose.Types.ObjectId(id);
    if (!(await this.commentModel.exists({ _id: objectId, isDeleted: false })))
      throw new NotFoundException('El comentario no existe');

    return objectId;
  }

  private async getPostsService() {
    const { PostsModule } = await import('../posts.module');
    const { PostsService } = await import('../posts.service');
    const postModule = await this.lazyModuleLoader.load(() => PostsModule);
    const postsService = postModule.get(PostsService);

    return postsService;
  }
}
