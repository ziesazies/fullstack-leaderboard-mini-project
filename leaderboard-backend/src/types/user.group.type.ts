import { Optional } from "sequelize";

export interface UserGroupAttributes {
  id: string;
  userId: string;
  groupId: string;
  data?: object;
  createdAt: Date;
  updatedAt: Date;
}

export type UserGroupCreationAttributes = Optional<
  UserGroupAttributes,
  "id" | "data" | "createdAt" | "updatedAt"
>;
