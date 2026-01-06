export type UserId = string;

export interface User {
  name: string;
  email: string;
}

export interface UserWithId extends User {
  id: UserId;
}

// Định nghĩa State cho slice này
export type UsersState = UserWithId[];