import axios from "axios";

const formatDateIST = (date) => {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = date.toLocaleString("en-IN", options);
  return formattedDate.replace("at ", "").replace("pm", "PM").replace("am", "AM");
};

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
      duration: contest.durationSeconds / 60,
      youtube_tutorial: "",
      url: `https://codeforces.com/contest/${contest.id}`,
    }));
  } catch (error) {
    console.error("Error fetching current and upcoming Codeforces contests:", error);
    return [];
  }
};

export { fetchCurrentAndUpcomingCodeforcesContests, fetchPastCodeforcesContests };
