export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  username: string;
  roles: Role[];
}

export interface Role {
  role: string;
}

export interface NewDelegate {
  name: string;
  shareRate: number;
  userId: string;
}

export interface OwnDelegate extends NewDelegate {
  _id: string;
}
