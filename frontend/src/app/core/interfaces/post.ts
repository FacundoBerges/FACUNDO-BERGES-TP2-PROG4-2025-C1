export interface Post {
  _id:           string;
  id?:           string;
  title:         string;
  description:   string;
  imageUrl?:     string | null;
  commentsCount: number;
  likesCount:    number;
  likes:         UserPostInteraction[];
  author:        PostAuthor;
  createdAt:     Date | string;
  updatedAt:     Date | string;
  isDeleted?:    boolean;
}

export interface CreatePost {
  title:       string;
  description: string;
  image?:      File | null;
}

export interface PostAuthor {
  _id:               string;
  name:              string;
  surname:           string;
  username:          string;
  profilePictureUrl: string | null;
}

export interface UserPostInteraction extends PostAuthor {}
