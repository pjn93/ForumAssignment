
export interface Comments {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: number;
    author: {
      id: number;
      name: string;
      email: string;
    };
  }