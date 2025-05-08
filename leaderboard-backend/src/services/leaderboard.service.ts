import { Op, Sequelize } from "sequelize";
import Exam from "../models/exam.model";
import User from "../models/user.model";
import UserGroup from "../models/user.group.model";
import sequelize from "../config/database";

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
        return this.specificTryoutAllUser(tryoutId);
      default:
        throw new Error(`Invalid leaderboard code: ${code}`);
    }
  }

  /**
   * AGAT - All User All Group All Tryout
   * Lists top users from all groups across all tryouts with average scores
   */
  // async getAllGroupAllTryoutAllUser() {
  //   try {
  //     const exams = await Exam.findAll({
  //       where: {
  //         active: true,
  //         [Op.and]: Sequelize.where(
  //           Sequelize.literal("data->>'status'"),
  //           "=",
  //           "submitted"
  //         ),
  //       },
  //       include: [
  //         {
  //           model: User,
  //           as: "user",
  //           attributes: ["id", "fullname", "username", "email"],
  //           required: true,
  //         },
  //       ],
  //       attributes: [
  //         "userId",
  //         [
  //           Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.scores"),
  //           "scores",
  //         ],
  //         [
  //           Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.duration"),
  //           "duration",
  //         ],
  //         [
  //           Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.startTime"),
  //           "startTime",
  //         ],
  //         [
  //           Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.endTime"),
  //           "endTime",
  //         ],
  //       ],
  //       raw: true,
  //     });

  //     return this.processLeaderboard(exams);
  //   } catch (error: any) {
  //     console.error("Error in getAllGroupAllTryoutAllUser:", error);
  //     throw new Error(`Failed to get leaderboard: ${error.message}`);
  //   }
  // }
  async getAllGroupAllTryoutAllUser() {
    try {
      const exams = await Exam.findAll({
        where: {
          active: true,
          [Op.and]: Sequelize.where(
            Sequelize.fn(
              "JSON_EXTRACT",
              Sequelize.col("Exam.data"),
              "$.status"
            ),
            "=",
            "submitted"
          ),
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
            required: true,
          },
        ],
        attributes: [
          "userId",
          [
            Sequelize.fn(
              "JSON_EXTRACT",
              Sequelize.col("Exam.data"),
              "$.scores"
            ),
            "scores",
          ],
          [
            Sequelize.fn(
              "JSON_EXTRACT",
              Sequelize.col("Exam.data"),
              "$.duration"
            ),
            "duration",
          ],
          [
            Sequelize.fn(
              "JSON_EXTRACT",
              Sequelize.col("Exam.data"),
              "$.startTime"
            ),
            "startTime",
          ],
          [
            Sequelize.fn(
              "JSON_EXTRACT",
              Sequelize.col("Exam.data"),
              "$.endTime"
            ),
            "endTime",
          ],
        ],
        raw: true,
      });

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in getAllGroupAllTryoutAllUser:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  async getAllGroupAllUserSpecificTryout(tryoutId: string) {
    try {
      const exams = await Exam.findAll({
        where: {
          active: true,
          [Op.and]: [
            Sequelize.where(
              Sequelize.literal("data->>'status'"),
              "=",
              "submitted"
            ),
            Sequelize.where(
              Sequelize.literal("data->>'tryoutSectionId'"),
              "=",
              tryoutId
            ),
          ],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
            required: true,
          },
        ],
        attributes: [
          "userId",
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.scores"),
            "scores",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.duration"),
            "duration",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.startTime"),
            "startTime",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.endTime"),
            "endTime",
          ],
        ],
        raw: true,
      });

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in getAllGroupAllUserSpecificTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  async specificGroupAllUserAllTryout(groupId: string) {
    try {
      const userGroups = await UserGroup.findAll({
        where: { groupId },
        attributes: ["userId"],
        raw: true,
      });

      if (!userGroups || userGroups.length === 0) {
        return []; // No users in this group
      }

      const userIds = userGroups.map((ug: any) => ug.userId);

      const exams = await Exam.findAll({
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
            required: true,
          },
        ],
        attributes: [
          "userId",
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.scores"),
            "scores",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.duration"),
            "duration",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.startTime"),
            "startTime",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.endTime"),
            "endTime",
          ],
        ],
        raw: true,
      });

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in specificGroupAllUserAllTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  async specificGroupAllUserSpecificTryout(groupId: string, tryoutId: string) {
    try {
      const userGroups = await UserGroup.findAll({
        where: { groupId },
        attributes: ["userId"],
        raw: true,
      });

      if (!userGroups || userGroups.length === 0) {
        return []; // No users in this group
      }

      const userIds = userGroups.map((ug: any) => ug.userId);

      const exams = await Exam.findAll({
        where: {
          active: true,
          [Op.and]: [
            Sequelize.where(
              Sequelize.literal("data->>'status'"),
              "=",
              "submitted"
            ),
            Sequelize.where(
              Sequelize.literal("data->>'tryoutSectionId'"),
              "=",
              tryoutId
            ),
          ],
          userId: { [Op.in]: userIds },
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
            required: true,
          },
        ],
        attributes: [
          "userId",
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.scores"),
            "scores",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.duration"),
            "duration",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.startTime"),
            "startTime",
          ],
          [
            Sequelize.fn("JSON_EXTRACT", Sequelize.col("data"), "$.endTime"),
            "endTime",
          ],
        ],
        raw: true,
      });

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in specificGroupAllUserSpecificTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  async specificTryoutAllUser(tryoutId: string) {
    return this.getAllGroupAllUserSpecificTryout(tryoutId);
  }

  private processLeaderboard(exams: any[]) {
    if (!exams || exams.length === 0) {
      return [];
    }

    const userScoresMap: Record<string, { user: any; scores: number[] }> = {};

    for (const exam of exams) {
      const userId = exam.userId;

      if (!userId || !exam["user.fullname"]) {
        console.warn("Skipping exam without valid user data:", exam);
        continue;
      }

      try {
        const score = parseFloat(exam.scores || "0");
        const duration = parseInt(exam.duration || "0");
        const start = new Date(exam.startTime || new Date()).getTime();
        const end = new Date(exam.endTime || new Date()).getTime();
        const elapsed = end - start;

        const timeScore = this.calculateTimeScore(elapsed, duration);
        const finalScore = score + timeScore;

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
      } catch (err) {
        console.error("Error processing exam for leaderboard:", err, exam);
        // Skip this exam but continue processing others
      }
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
