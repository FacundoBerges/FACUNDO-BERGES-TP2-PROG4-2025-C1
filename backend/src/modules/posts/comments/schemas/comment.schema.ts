import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 500 })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Post', required: true })
  post: mongoose.Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
