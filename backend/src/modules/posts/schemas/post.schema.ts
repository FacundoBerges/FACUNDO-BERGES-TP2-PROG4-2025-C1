import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({})
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 100, minlength: 2 })
  title: string;

  @Prop({ required: true, maxlength: 500, minlength: 10 })
  description: string;

  @Prop({ default: null })
  imageUrl?: string;

  // TODO: add array of comments

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  authorId: mongoose.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
