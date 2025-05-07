export interface UserAttributes {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  active: boolean;
  data: object | null;
  createdAt: Date;
  updatedAt: Date;
}
