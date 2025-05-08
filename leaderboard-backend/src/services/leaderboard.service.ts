import { Op, Sequelize, QueryTypes } from "sequelize";
import Exam from "../models/exam.model"; // Meskipun tidak digunakan langsung untuk query, bisa tetap dipertahankan untuk referensi model
import User from "../models/user.model"; // Sama seperti Exam
import UserGroup from "../models/user.group.model"; // Sama seperti Exam, atau jika ada operasi lain yang masih menggunakannya
import sequelize from "../config/database"; // Pastikan path ini benar

export class LeaderboardService {
  /**
   * Calculate time score based on elapsed time and duration
   * Score = -(elapsed time) / (duration)
   */
  private calculateTimeScore(elapsedTime: number, duration: number): number {
    if (duration === 0) {
      // Hindari pembagian dengan nol
      return 0;
    }
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
  async getAllGroupAllTryoutAllUser() {
    try {
      // Kueri ini sudah benar dan menggunakan raw SQL
      const query = `
        SELECT 
          e.userId, 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS scores,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.duration')) AS duration,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.startTime')) AS startTime,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.endTime')) AS endTime,
          u.id AS 'user.id',
          u.fullname AS 'user.fullname',
          u.username AS 'user.username',
          u.email AS 'user.email'
        FROM exams e
        JOIN users u ON e.userId = u.id
        WHERE JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) = 'submitted'
        AND e.active = 1
      `;
      const exams = (await sequelize.query(query, {
        type: QueryTypes.SELECT,
      })) as any[];

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in getAllGroupAllTryoutAllUser:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  /**
   * AGST - All Group, All User, Specific Tryout
   * Lists top users from all groups for a specific tryout with average scores
   */
  async getAllGroupAllUserSpecificTryout(tryoutId: string) {
    try {
      const query = `
        SELECT 
          e.userId, 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS scores,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.duration')) AS duration,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.startTime')) AS startTime,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.endTime')) AS endTime,
          u.id AS 'user.id',
          u.fullname AS 'user.fullname',
          u.username AS 'user.username',
          u.email AS 'user.email'
        FROM exams e
        JOIN users u ON e.userId = u.id
        WHERE JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) = 'submitted'
        AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionId')) = :tryoutId
        AND e.active = 1
      `;
      const exams = (await sequelize.query(query, {
        replacements: { tryoutId: tryoutId },
        type: QueryTypes.SELECT,
      })) as any[];

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in getAllGroupAllUserSpecificTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  /**
   * SGAT - Specific Group, All User, All Tryout
   * Lists top users from a specific group across all tryouts with average scores
   */
  async specificGroupAllUserAllTryout(groupId: string) {
    try {
      const query = `
        SELECT 
          e.userId, 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS scores,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.duration')) AS duration,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.startTime')) AS startTime,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.endTime')) AS endTime,
          u.id AS 'user.id',
          u.fullname AS 'user.fullname',
          u.username AS 'user.username',
          u.email AS 'user.email'
        FROM exams e
        JOIN users u ON e.userId = u.id
        JOIN users_groups ug ON u.id = ug.userId 
        WHERE JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) = 'submitted'
        AND e.active = 1
        AND ug.groupId = :groupId 
      `;
      // Catatan: 'user_groups' adalah nama tabel yang diasumsikan untuk model UserGroup.
      // Sesuaikan jika nama tabel di database Anda berbeda.
      // Berdasarkan pengecekan model Anda, nama tabelnya adalah "user_groups".
      // groupId di user_groups juga diasumsikan bernama 'groupId'. Sesuaikan jika berbeda.

      const exams = (await sequelize.query(query, {
        replacements: { groupId: groupId },
        type: QueryTypes.SELECT,
      })) as any[];

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in specificGroupAllUserAllTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  /**
   * SGST - Specific Group, All User, Specific Tryout
   * Lists top users from a specific group for a specific tryout with average scores
   */
  async specificGroupAllUserSpecificTryout(groupId: string, tryoutId: string) {
    try {
      const query = `
        SELECT 
          e.userId, 
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.scores')) AS scores,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.duration')) AS duration,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.startTime')) AS startTime,
          JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.endTime')) AS endTime,
          u.id AS 'user.id',
          u.fullname AS 'user.fullname',
          u.username AS 'user.username',
          u.email AS 'user.email'
        FROM exams e
        JOIN users u ON e.userId = u.id
        JOIN users_groups ug ON u.id = ug.userId
        WHERE JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.status')) = 'submitted'
        AND JSON_UNQUOTE(JSON_EXTRACT(e.data, '$.tryoutSectionId')) = :tryoutId
        AND e.active = 1
        AND ug.groupId = :groupId
      `;
      // Catatan: 'user_groups' adalah nama tabel yang diasumsikan untuk model UserGroup.
      // Sesuaikan jika nama tabel di database Anda berbeda.
      // Berdasarkan pengecekan model Anda, nama tabelnya adalah "user_groups".
      // groupId di user_groups juga diasumsikan bernama 'groupId'. Sesuaikan jika berbeda.

      const exams = (await sequelize.query(query, {
        replacements: { groupId: groupId, tryoutId: tryoutId },
        type: QueryTypes.SELECT,
      })) as any[];

      return this.processLeaderboard(exams);
    } catch (error: any) {
      console.error("Error in specificGroupAllUserSpecificTryout:", error);
      throw new Error(`Failed to get leaderboard: ${error.message}`);
    }
  }

  /**
   * ST - Specific Tryout, All User
   * This function calls getAllGroupAllUserSpecificTryout, which is already refactored.
   */
  async specificTryoutAllUser(tryoutId: string) {
    // Fungsi ini sudah memanggil fungsi lain yang telah direfactor,
    // jadi tidak perlu perubahan langsung di sini kecuali jika logikanya ingin diubah.
    return this.getAllGroupAllUserSpecificTryout(tryoutId);
  }

  private processLeaderboard(exams: any[]) {
    if (!exams || exams.length === 0) {
      return [];
    }

    const userScoresMap: Record<
      string,
      {
        user: any;
        scores: number[];
        totalDuration: number;
        totalElapsed: number;
        examCount: number;
      }
    > = {};

    for (const exam of exams) {
      const userId = exam.userId;

      // Pastikan user data ada, terutama user.fullname yang digunakan untuk membuat objek user
      if (!userId || !exam["user.fullname"]) {
        console.warn("Skipping exam without valid user data:", exam);
        continue;
      }

      try {
        // Parsing dengan fallback ke 0 atau nilai default jika null/undefined/kosong
        const scoreString = exam.scores || "0";
        const durationString = exam.duration || "0";
        const startTimeString = exam.startTime; // Biarkan null jika memang null
        const endTimeString = exam.endTime; // Biarkan null jika memang null

        const score = parseFloat(scoreString);
        const duration = parseInt(durationString, 10);

        let elapsed = 0;
        // Hanya hitung elapsed time jika startTime dan endTime valid
        if (startTimeString && endTimeString) {
          const start = new Date(startTimeString).getTime();
          const end = new Date(endTimeString).getTime();
          if (!isNaN(start) && !isNaN(end)) {
            elapsed = end - start;
          } else {
            console.warn(`Invalid startTime or endTime for exam:`, exam);
          }
        } else {
          console.warn(`Missing startTime or endTime for exam:`, exam);
        }

        if (!userScoresMap[userId]) {
          userScoresMap[userId] = {
            user: {
              id: userId,
              fullname: exam["user.fullname"],
              username: exam["user.username"],
              email: exam["user.email"],
            },
            scores: [],
            totalDuration: 0,
            totalElapsed: 0,
            examCount: 0,
          };
        }

        userScoresMap[userId].scores.push(score); // Simpan skor mentah tryout
        userScoresMap[userId].totalDuration += duration;
        userScoresMap[userId].totalElapsed += elapsed;
        userScoresMap[userId].examCount += 1;
      } catch (err) {
        console.error(
          "Error processing individual exam data for leaderboard:",
          err,
          exam
        );
        // Lewati ujian ini tetapi lanjutkan memproses yang lain
      }
    }

    return Object.values(userScoresMap)
      .map(({ user, scores, totalDuration, totalElapsed, examCount }) => {
        // Hitung rata-rata skor dari semua tryout yang diikuti user
        const averageRawScore =
          examCount > 0 ? scores.reduce((acc, s) => acc + s, 0) / examCount : 0;

        // Hitung timeScore berdasarkan total waktu dan total durasi semua tryout
        const timeScore = this.calculateTimeScore(totalElapsed, totalDuration);

        const finalAverageScore = averageRawScore + timeScore;

        return {
          ...user,
          averageScore: Number(finalAverageScore.toFixed(2)), // Skor akhir yang sudah termasuk timeScore
          // Anda bisa tambahkan detail lain jika perlu, misalnya:
          // totalTryouts: examCount,
          // rawAverage: Number(averageRawScore.toFixed(2))
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);
  }
}

export default LeaderboardService;
