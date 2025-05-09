export interface LeaderboardEntry {
  id: string;
  fullname: string;
  username: string;
  email: string;
  groupId: string;
  groupTitle: string;
  tryoutSectionId: string;
  tryoutSectionTitle: string;
  score: number;
  averageScore: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
  message?: string;
}
