export interface UserData {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

export interface NewUserData {
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  findByEmail: (email: string) => Promise<UserData | undefined>;
  create: (input: NewUserData) => Promise<UserData | undefined>;
  findById: (id: string) => Promise<UserData | undefined>;
}
