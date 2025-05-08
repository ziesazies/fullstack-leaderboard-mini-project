export interface TryoutSectionRef {
  id: string;
}

export interface ExamQuestion {
  id: string;
  score: number;
  answer: string;
  imageType: string;
  examAnswer: string;
  scrambledLabel: { label: string; examLabel: string }[];
  tryoutSections: TryoutSectionRef[];
}

export interface ExamData {
  scores: number;
  status: "submitted" | "completed" | "in-progress" | "cancelled";
  startTime: string;
  endTime: string;
  duration: number;
  platform: string;
  tryoutSectionId: string;
  tryoutSectionTitle: string;
  questions: ExamQuestion[];
}
