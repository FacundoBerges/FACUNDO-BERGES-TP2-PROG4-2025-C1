export interface Post {
  _id:           string;
  id?:           string;
  title:         string;
  description:   string;
  imageUrl?:     string | null;
  commentsCount: number;
  likesCount:    number;
  likes:         PostLike[] | string[];
  author:        PostAuthor;
  createdAt:     Date | string;
  updatedAt:     Date | string;
  isDeleted?:    boolean;
}

export interface PostAuthor {
  _id:               string;
  name:              string;
  surname:           string;
  username:          string;
  profilePictureUrl: string | null;
}

export interface PostLike {
  _id:               string;
  name?:             string,
  surname?:          string,
  username?:         string;
  profilePictureUrl: string |null,
}
