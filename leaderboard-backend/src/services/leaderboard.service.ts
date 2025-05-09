import { Op, Sequelize, QueryTypes } from "sequelize";
import Exam from "../models/exam.model";
import User from "../models/user.model";
import UserGroup from "../models/user.group.model";
import sequelize from "../config/database";

export class LeaderboardService {
  private calculateTimeScore(elapsedTime: number, duration: number): number {
    if (duration === 0) return 0;
    return -(elapsedTime / duration);
  }

  async getLeaderboard(code: string, params: any = {}) {
    const { groupId, tryoutId } = params;

    switch (code.toUpperCase()) {
      case "AGAT":
        return this.getAllGroupAllTryoutAllUser();
      case "AGST":
        if (!tryoutId) throw new Error("Tryout ID is required for AGST mode");
        return this.getAllGroupAllUserSpecificTryout(tryoutId);
      case "SGAT":
        if (!groupId) throw new Error("Group ID is required for SGAT mode");
        return this.specificGroupAllUserAllTryout(groupId);
      case "SGST":
        if (!groupId) throw new Error("Group ID is required for SGST mode");
        if (!tryoutId) throw new Error("Tryout ID is required for SGST mode");
        return this.specificGroupAllUserSpecificTryout(groupId, tryoutId);
      case "ST":
        if (!tryoutId) throw new Error("Tryout ID is required for ST mode");
        return this.getAllGroupAllUserSpecificTryout(tryoutId);
      default:
        throw new Error(`Invalid leaderboard code: ${code}`);
    }
  }

  async getAllGroupAllTryoutAllUser() {
    const query = this.baseQuery();
    const exams = await sequelize.query(query, { type: QueryTypes.SELECT });
    return this.processLeaderboardWithGroup(exams as any[]);
  }

  async getAllGroupAllUserSpecificTryout(tryoutId: string) {
    const query = `${this.baseQuery()} AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionId')) = :tryoutId;`;
    const exams = await sequelize.query(query, {
      replacements: { tryoutId },
      type: QueryTypes.SELECT,
    });
    return this.processLeaderboardWithGroup(exams as any[]);
  }

  async specificGroupAllUserAllTryout(groupId: string) {
    const query = `${this.baseQuery()} AND ug.groupId = :groupId;`;
    const exams = await sequelize.query(query, {
      replacements: { groupId },
      type: QueryTypes.SELECT,
    });
    return this.processLeaderboardWithGroup(exams as any[]);
  }

  async specificGroupAllUserSpecificTryout(groupId: string, tryoutId: string) {
    const query = `${this.baseQuery()} AND ug.groupId = :groupId AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionId')) = :tryoutId;`;
    const exams = await sequelize.query(query, {
      replacements: { groupId, tryoutId },
      type: QueryTypes.SELECT,
    });
    return this.processLeaderboardWithGroup(exams as any[]);
  }

  private baseQuery(): string {
    return `
      SELECT 
        e.userId, 
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS scores,
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.duration')) AS duration,
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.startTime')) AS startTime,
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.endTime')) AS endTime,
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionTitle')) AS tryoutSectionTitle,
        JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionId')) AS tryoutSectionId,
        u.id AS 'user.id',
        u.fullname AS 'user.fullname',
        u.username AS 'user.username',
        u.email AS 'user.email',
        ug.groupId AS 'user.groupId',
        g.title AS 'group.title'
      FROM exams e
      JOIN users u ON e.userId = u.id
      JOIN users_groups ug ON u.id = ug.userId
      JOIN \`groups\` g ON ug.groupId = g.id
      WHERE JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) = 'submitted'
        AND e.active = 1`;
  }

  private processLeaderboardWithGroup(exams: any[]) {
    if (!exams || exams.length === 0) return [];

    const userScoresMap: Record<string, any> = {};

    for (const exam of exams) {
      const userId = exam.userId;
      if (!userId || !exam["user.fullname"]) continue;

      const score = parseFloat(exam.scores || "0");
      const duration = parseInt(exam.duration || "0", 10);
      let elapsed = 0;

      const start = new Date(exam.startTime).getTime();
      const end = new Date(exam.endTime).getTime();
      if (!isNaN(start) && !isNaN(end)) elapsed = end - start;

      if (!userScoresMap[userId]) {
        userScoresMap[userId] = {
          user: {
            id: userId,
            fullname: exam["user.fullname"],
            username: exam["user.username"],
            email: exam["user.email"],
            groupId: exam["user.groupId"],
            groupTitle: exam["group.title"],
            tryoutSectionId: exam["tryoutSectionId"],
            tryoutSectionTitle: exam["tryoutSectionTitle"],
          },
          scores: [],
          totalDuration: 0,
          totalElapsed: 0,
          examCount: 0,
        };
      }

      userScoresMap[userId].scores.push(score);
      userScoresMap[userId].totalDuration += duration;
      userScoresMap[userId].totalElapsed += elapsed;
      userScoresMap[userId].examCount += 1;
    }

    return Object.values(userScoresMap)
      .map((data) => {
        const { user, scores, totalDuration, totalElapsed, examCount } = data;
        const rawAvg = scores.reduce((a: any, b: any) => a + b, 0) / examCount;
        const timeScore = this.calculateTimeScore(totalElapsed, totalDuration);
        const finalScore = rawAvg + timeScore;

        return {
          ...user,
          score: Number(rawAvg.toFixed(2)),
          averageScore: Number(finalScore.toFixed(2)),
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);
  }
}

export default LeaderboardService;
