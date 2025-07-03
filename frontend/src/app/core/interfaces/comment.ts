import { PostAuthor } from "./post";

export interface Comment {
  _id:        string;
  content:    string;
  createdAt?: Date;
  updatedAt?: Date;
  author:     PostAuthor;
}

export interface CommentDto {
  _id?:    string;
  content: string;
}
