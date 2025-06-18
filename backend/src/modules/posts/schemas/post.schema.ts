import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop({ type: mongoose.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 100, minlength: 2 })
  title: string;

  @Prop({ required: true, maxlength: 500, minlength: 1 })
  description: string;

  @Prop({ default: null })
  imageUrl?: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }], default: [] })
  likes?: mongoose.Types.ObjectId[];

  @Virtual({
    get: function (this: Post) {
      return this.likes ? this.likes.length : 0;
    },
  })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  commentsCount: number;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  author: mongoose.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
