import { Op, Sequelize } from "sequelize";
import Exam from "../models/exam.model.js";
import User from "../models/user.model.js";
import UserGroup from "../models/user.group.model.js";
import sequelize from "../config/database.js";

export class LeaderboardService {
  /**
   * Calculate time score based on elapsed time and duration
   * Score = -(elapsed time) / (duration)
   */
  private calculateTimeScore(elapsedTime: number, duration: number) {
    return -(elapsedTime / duration);
  }

  /**
   * Get leaderboard based on specific code:
   * - AGAT: All Group, All User, All Tryout
   * - AGST: All Group, All User, Specific Tryout
   * - SGAT: Specific Group, All User, All Tryout
   * - SGST: Specific Group, All User, Specific Tryout
   * - ST: Specific Tryout, All User
   */
  async getLeaderboard(code: string, params: any = {}) {
    const { groupId, tryoutId } = params;

    switch (code.toUpperCase()) {
      case "AGAT":
        return this.getAllGroupAllTryoutAllUser();
      case "AGST":
        return this.getAllGroupAllTryoutSpecificUser(tryoutId);
      case "SGAT":
        return this.specificGroupAllUserAllTryout(groupId);
      case "SGST":
        return this.specificGroupAllUserSpecificTryout(groupId, tryoutId);
      case "ST":
        return this.specificTryoutAllUser(tryoutId);
      default:
        throw new Error("Wrong leaderboard code");
    }
  }

  /**
   * AGAT - All User All Group All Tryout
   * Lists top users from all groups across all tryouts with average scores
   */
  async getAllGroupAllTryoutAllUser() {
    const exams = (await Exam.findAll({
      where: {
        active: true,
        [Op.and]: Sequelize.where(
          Sequelize.literal("data->>'status'"),
          "=",
          "submitted"
        ),
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullname", "username", "email"],
        },
      ],
      attributes: [
        "userId",
        [Sequelize.literal(`data->>'scores'`), "scores"],
        [Sequelize.literal(`data->>'duration'`), "duration"],
        [Sequelize.literal(`data->>'startTime'`), "startTime"],
        [Sequelize.literal(`data->>'endTime'`), "endTime"],
      ],
      raw: true,
    })) as any[];

    return this.processLeaderboard(exams);
  }

  async getAllGroupAllTryoutSpecificUser(tryoutId: string) {
    const exams = (await Exam.findAll({
      where: {
        active: true,
        [Op.and]: Sequelize.where(
          Sequelize.literal("data->>'status'"),
          "=",
          "submitted"
        ),
        "data.tryoutSectionId": tryoutId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullname", "username", "email"],
        },
      ],
      attributes: [
        "userId",
        [Sequelize.literal(`data->>'scores'`), "scores"],
        [Sequelize.literal(`data->>'duration'`), "duration"],
        [Sequelize.literal(`data->>'startTime'`), "startTime"],
        [Sequelize.literal(`data->>'endTime'`), "endTime"],
      ],
      raw: true,
    })) as any[];

    return this.processLeaderboard(exams);
  }

  async specificGroupAllUserAllTryout(groupId: string) {
    if (!groupId) throw new Error("Group ID is required for SGAT mode");
    const userGroups = (await UserGroup.findAll({
      where: { groupId },
      attributes: ["userId"],
      raw: true,
    })) as unknown as Array<{ userId: string }>; // ← fix ini

    const userIds = userGroups.map((ug) => ug.userId);

    const exams = (await Exam.findAll({
      where: {
        active: true,
        [Op.and]: Sequelize.where(
          Sequelize.literal("data->>'status'"),
          "=",
          "submitted"
        ),
        userId: { [Op.in]: userIds },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullname", "username", "email"],
        },
      ],
      attributes: [
        "userId",
        [Sequelize.literal(`data->>'scores'`), "scores"],
        [Sequelize.literal(`data->>'duration'`), "duration"],
        [Sequelize.literal(`data->>'startTime'`), "startTime"],
        [Sequelize.literal(`data->>'endTime'`), "endTime"],
      ],
      raw: true,
    })) as any[];

    return this.processLeaderboard(exams);
  }

  async specificGroupAllUserSpecificTryout(groupId: string, tryoutId: string) {
    if (!groupId) throw new Error("Group ID is required for SGAT mode");
    if (!tryoutId) throw new Error("Tryout ID is required for SGAT mode");
    const userGroups = await UserGroup.findAll({
      where: { groupId },
      attributes: ["userId"],
      raw: true,
    });

    const userIds = userGroups.map((ug) => ug.userId);

    const exams = (await Exam.findAll({
      where: {
        active: true,
        [Op.and]: Sequelize.where(
          Sequelize.literal("data->>'status'"),
          "=",
          "submitted"
        ),
        "data.tryoutSectionId": tryoutId,
        userId: { [Op.in]: userIds },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullname", "username", "email"],
        },
      ],
      attributes: [
        "userId",
        [Sequelize.literal(`data->>'scores'`), "scores"],
        [Sequelize.literal(`data->>'duration'`), "duration"],
        [Sequelize.literal(`data->>'startTime'`), "startTime"],
        [Sequelize.literal(`data->>'endTime'`), "endTime"],
      ],
      raw: true,
    })) as any[];

    return this.processLeaderboard(exams);
  }

  async specificTryoutAllUser(tryoutId: string) {
    if (!tryoutId) throw new Error("Group ID is required for SGAT mode");
    return this.getAllGroupAllTryoutSpecificUser(tryoutId);
  }

  private processLeaderboard(exams: any[]) {
    const userScoresMap: Record<string, { user: any; scores: number[] }> = {};

    for (const exam of exams) {
      const score = parseFloat(exam["scores"]);
      const duration = parseInt(exam["duration"]);
      const start = new Date(exam["startTime"]).getTime();
      const end = new Date(exam["endTime"]).getTime();
      const elapsed = end - start;

      const timeScore = this.calculateTimeScore(elapsed, duration);
      const finalScore = score + timeScore;

      const userId = exam["userId"];

      if (!userScoresMap[userId]) {
        userScoresMap[userId] = {
          user: {
            id: userId,
            fullname: exam["user.fullname"],
            username: exam["user.username"],
            email: exam["user.email"],
          },
          scores: [],
        };
      }

      userScoresMap[userId].scores.push(finalScore);
    }

    return Object.values(userScoresMap)
      .map(({ user, scores }) => ({
        ...user,
        averageScore: Number(
          (scores.reduce((acc, s) => acc + s, 0) / scores.length).toFixed(2)
        ),
      }))
      .sort((a, b) => b.averageScore - a.averageScore);
  }
}

export default LeaderboardService;
