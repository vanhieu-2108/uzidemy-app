export enum EPostStatus {
  PENDING = "PENDING",
  PUBLIC = "PUBLIC",
  DELETED = "DELETED",
}

export interface Post {
  _id: string;
  user_id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  status: EPostStatus;
  created_at: string;
  updated_at: string;
  user: {
    avatar: string;
  };
  _destroy: boolean;
}
