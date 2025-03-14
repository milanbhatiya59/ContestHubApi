import axios from "axios";

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result;

    // Extract ongoing and future contests
    const currentAndUpcomingContests = contests.filter(
      (contest) => contest.phase === "BEFORE" || contest.phase === "CODING"
    );

    // Extract last 50 finished contests
    const pastContests = contests.filter((contest) => contest.phase === "FINISHED").slice(0, 50); // Get the most recent 50 finished contests

    // Format contests
    const formattedContests = [...currentAndUpcomingContests, ...pastContests].map((contest) => ({
      name: contest.name,
      platform: "Codeforces",
      startTime: formatDate(new Date(contest.startTimeSeconds * 1000)), // Convert from seconds
      timeRemaining: getTimeRemaining(new Date(contest.startTimeSeconds * 1000), contest.phase),
      status: contest.phase, // BEFORE, CODING, or FINISHED
      url: `https://codeforces.com/contest/${contest.id}`,
    }));

    console.log(formattedContests);

    return formattedContests;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};

// Format Date as "YYYY-MM-DD HH:mm UTC"
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
};

// Get time remaining (in HH:MM:SS or "Started" / "Finished")
const getTimeRemaining = (startDate, phase) => {
  const now = new Date();
  const diffMs = startDate - now; // Difference in milliseconds

  if (phase === "FINISHED") return "Finished";
  if (diffMs <= 0) return "Started"; // Contest already started

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

fetchCodeforcesContests();

// module.exports = { fetchCodeforcesContests };
