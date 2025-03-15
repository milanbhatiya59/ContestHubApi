import axios from "axios";

// Convert UTC timestamp to Indian Standard Time (IST) and format it
const formatDateIST = (date) => {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata", // Indian Time Zone
  };

  const formattedDate = date.toLocaleString("en-IN", options);

  // Format "8:00 PM, 26 March 2025" to "8:00 PM 26 March 2025"
  return formattedDate.replace("at ", "").replace("pm", "PM").replace("am", "AM");
};

// Fetch past Codeforces contests (last 50 finished)
const fetchPastCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result;

    const pastContests = contests.filter((contest) => contest.phase === "FINISHED").slice(0, 200);

    return pastContests.map((contest) => ({
      platform: "Codeforces",
      name: contest.name,
      start_time: formatDateIST(new Date(contest.startTimeSeconds * 1000)),
      duration: contest.durationSeconds / 60,
      youtube_tutorial: "",
      url: `https://codeforces.com/contest/${contest.id}`,
    }));
  } catch (error) {
    console.error("Error fetching past Codeforces contests:", error);
    return [];
  }
};

// Fetch current and upcoming Codeforces contests
const fetchCurrentAndUpcomingCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result;

    const currentAndUpcomingContests = contests.filter(
      (contest) => contest.phase === "BEFORE" || contest.phase === "CODING"
    );

    return currentAndUpcomingContests.map((contest) => ({
      platform: "Codeforces",
      name: contest.name,
      start_time: formatDateIST(new Date(contest.startTimeSeconds * 1000)),
      duration: contest.durationSeconds / 60, // Convert duration to minutes
    }));
  } catch (error) {
    console.error("Error fetching current and upcoming Codeforces contests:", error);
    return [];
  }
};

// Export functions for external use
export { fetchCurrentAndUpcomingCodeforcesContests, fetchPastCodeforcesContests };
