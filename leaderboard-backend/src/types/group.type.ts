export interface GroupAttributes {
  id: string;
  parentId: string | null;
  code: string;
  title: string;
  data: object | null;
  tag: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
