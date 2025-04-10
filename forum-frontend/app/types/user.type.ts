// Define types for your request and response
export type User = {
  id: number;
  name: string;
  email: string;
};

// Define types for your request and response
export type SignUpRequest = {
  name?: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  token: string;
  user: User;
};