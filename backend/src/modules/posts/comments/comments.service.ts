import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from '../posts.service';
import { SortOptions, SortOrder } from '../interfaces/sort-by.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(
    userData: JwtPayload,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const newComment = await this.commentModel.create({
      content: createCommentDto.content,
      author: new mongoose.Types.ObjectId(userData.sub),
      post: new mongoose.Types.ObjectId(postId),
    });
    const savedComment = await newComment.save();

    await this.postsService.addComment(postId, savedComment._id.toString());

    return savedComment;
  }

  async findAll(
    postId: string,
    offset: number,
    limit: number,
    sortBy: SortOptions,
    orderBy: SortOrder,
  ) {
    await this.postsService.validateId(postId);

    return await this.commentModel
      .find({ post: new mongoose.Types.ObjectId(postId) })
      .populate('author', 'username createdAt')
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

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }

  async validateCommentOwnership(userData: JwtPayload, commentId: string) {
    await this.validateId(commentId);

    const comment = await this.commentModel
      .findById(commentId)
      .populate('author', 'username createdAt')
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
      throw new BadRequestException('El comentario no existe');
  }
}
