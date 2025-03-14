import { getCurrentAndUpcomingCodechefContests } from "../services/codechef.service.js";
import { getCurrentAndUpcomingCodeforcesContests } from "../services/codeforces.service.js";
import { fetchCurrentAndUpcomingLeetCodeContests } from "../services/leetcode.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUpcomingContests = asyncHandler(async (req, res) => {
  const codechef = await getCurrentAndUpcomingCodechefContests();
  const codeforces = await getCurrentAndUpcomingCodeforcesContests();
  const leetcode = await fetchCurrentAndUpcomingLeetCodeContests();

  const contests = [...codechef, ...codeforces, ...leetcode];

  contests.sort((a, b) => {
    return new Date(a.start_time) - new Date(b.start_time);
  });

  res.json({ contests });
});

export { getAllUpcomingContests };
