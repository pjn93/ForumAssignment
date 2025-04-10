import { Comments } from "./comment.type";

// Define types for your forum data
export interface Forum {
  id: number;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  comments: Comments[]; // You might want to define a proper Comment type later
}

// Request/Response types
export interface CreateForumRequest {
  title: string;
  description: string;
  tags?: string;
}

export interface ForumsResponse {
  success: boolean;
  message: string;
  data: Forum[];
}

