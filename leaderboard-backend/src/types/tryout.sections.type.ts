export interface TryoutSectionAttributes {
  id: string;
  code: string;
  description: string | null;
  title: string;
  order: number | null;
  data: {
    startDate: Date;
    endDate: Date;
    type?: "telegram" | "website" | "accuracy_test";
  } | null;
  tag: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
