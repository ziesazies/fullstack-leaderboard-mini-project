import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "../types/leaderboard";
import { getLeaderboard } from "../services/api";
import { TrophyIcon } from "@heroicons/react/24/solid";

interface LeaderboardProps {
  code: string;
}

export const Leaderboard = ({ code }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedTryout, setSelectedTryout] = useState<string>("All");
  const [allGroups, setAllGroups] = useState<string[]>([]);
  const [allTryouts, setAllTryouts] = useState<string[]>([]);
  const [groupTitleToId, setGroupTitleToId] = useState<Record<string, string>>({});
  const [tryoutTitleToId, setTryoutTitleToId] = useState<Record<string, string>>({});

  // Initial load to get all possible groups and tryouts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getLeaderboard("AGAT");
        if (response.success) {
          const uniqueGroups = ["All", ...new Set(response.data.map(entry => entry.groupTitle))];
          const uniqueTryouts = ["All", ...new Set(response.data.map(entry => entry.tryoutSectionTitle))];
          
          // Create mappings for titles to IDs
          const groupMapping: Record<string, string> = {};
          const tryoutMapping: Record<string, string> = {};
          
          response.data.forEach(entry => {
            groupMapping[entry.groupTitle] = entry.groupId;
            tryoutMapping[entry.tryoutSectionTitle] = entry.tryoutSectionId;
          });

          setAllGroups(uniqueGroups);
          setAllTryouts(uniqueTryouts);
          setGroupTitleToId(groupMapping);
          setTryoutTitleToId(tryoutMapping);
          setEntries(response.data);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let endpoint = "AGAT"; // Default to AGAT
        const params: Record<string, string> = {};

        if (selectedGroup !== "All" && selectedTryout !== "All") {
          endpoint = "SGST";
          params.groupId = groupTitleToId[selectedGroup] || "";
          params.tryoutId = tryoutTitleToId[selectedTryout] || "";
        } else if (selectedGroup !== "All") {
          endpoint = "SGAT";
          params.groupId = groupTitleToId[selectedGroup] || "";
        } else if (selectedTryout !== "All") {
          endpoint = "AGST";
          params.tryoutId = tryoutTitleToId[selectedTryout] || "";
        }

        const response = await getLeaderboard(endpoint, Object.keys(params).length > 0 ? params : undefined);
        if (response.success) {
          setEntries(response.data);
          setError(null);
        } else {
          setError(response.message || "Failed to load leaderboard data");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load leaderboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGroup, selectedTryout, groupTitleToId, tryoutTitleToId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
        <p>No entries found for this leaderboard.</p>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const remainingEntries = entries.slice(3);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white">
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] p-6 w-full border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <TrophyIcon className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[#1A1A1A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="group" className="block text-sm font-medium text-gray-300 mb-1">
                Group
              </label>
              <select
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="block w-full rounded-md bg-[#2A2A2A] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                {allGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="tryout" className="block text-sm font-medium text-gray-300 mb-1">
                Tryout
              </label>
              <select
                id="tryout"
                value={selectedTryout}
                onChange={(e) => setSelectedTryout(e.target.value)}
                className="block w-full rounded-md bg-[#2A2A2A] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                {allTryouts.map((tryout) => (
                  <option key={tryout} value={tryout}>
                    {tryout}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Podium Section */}
      <div className="p-8 bg-[#0A0A0A] w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-end space-x-16 h-[400px]">
            {/* Second Place */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#2A2A2A] border-4 border-gray-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">2</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-white text-center">{topThree[1]?.fullname}</span>
                <span className="text-sm text-gray-400 text-center">{topThree[1]?.groupTitle}</span>
                <span className="text-sm text-gray-400 text-center max-w-[200px]">{topThree[1]?.tryoutSectionTitle}</span>
                <span className="text-lg font-bold text-gray-300">{topThree[1]?.score}</span>
              </div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-28 h-28 rounded-full bg-[#2A2A2A] border-4 border-yellow-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-500">1</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-white text-center">{topThree[0]?.fullname}</span>
                <span className="text-sm text-gray-400 text-center">{topThree[0]?.groupTitle}</span>
                <span className="text-sm text-gray-400 text-center max-w-[200px]">{topThree[0]?.tryoutSectionTitle}</span>
                <span className="text-lg font-bold text-yellow-500">{topThree[0]?.score}</span>
              </div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#2A2A2A] border-4 border-amber-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-white text-center">{topThree[2]?.fullname}</span>
                <span className="text-sm text-gray-400 text-center">{topThree[2]?.groupTitle}</span>
                <span className="text-sm text-gray-400 text-center max-w-[200px]">{topThree[2]?.tryoutSectionTitle}</span>
                <span className="text-lg font-bold text-amber-600">{topThree[2]?.score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Entries Table */}
      {remainingEntries.length > 0 && (
        <div className="w-full overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Group
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tryout Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#0A0A0A] divide-y divide-gray-800">
                {remainingEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#1A1A1A] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{entry.fullname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{entry.groupTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{entry.tryoutSectionTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-white">{entry.score}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
