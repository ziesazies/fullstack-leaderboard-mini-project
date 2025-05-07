export interface ExamAttributes {
  id: string;
  userId: string;
  data: {
    status?: "in-progress" | "completed" | "cancelled" | "submitted";
    type?: "reading" | "telegram" | "website" | "accuracy_test";
  } | null;
  tag: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
