import cron from "node-cron";
import { PastContest } from "../models/past-contest.model.js";
import { UpcomingContest } from "../models/upcoming-contest.model.js";
import { fetchCurrentAndUpcomingCodechefContests } from "../services/codechef.service.js";
import { fetchCurrentAndUpcomingCodeforcesContests } from "../services/codeforces.service.js";
import { fetchCurrentAndUpcomingLeetCodeContests } from "../services/leetcode.service.js";

cron.schedule("*/30 * * * *", async () => {
  try {
    const codechef = await fetchCurrentAndUpcomingCodechefContests();
    const codeforces = await fetchCurrentAndUpcomingCodeforcesContests();
    const leetcode = await fetchCurrentAndUpcomingLeetCodeContests();

    const fetchedContests = [...codechef, ...codeforces, ...leetcode];
    fetchedContests.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    const existingContests = await UpcomingContest.find();

    const areContestsEqual = (contestA, contestB) => {
      return (
        contestA.platform === contestB.platform &&
        contestA.name === contestB.name &&
        contestA.start_time === contestB.start_time &&
        contestA.duration === contestB.duration
      );
    };

    const newUpcomingContests = fetchedContests.filter(
      (fetched) => !existingContests.some((existing) => areContestsEqual(fetched, existing))
    );

    const oldUpcomingContests = existingContests.filter(
      (existing) => !fetchedContests.some((fetched) => areContestsEqual(existing, fetched))
    );

    if (newUpcomingContests.length > 0) {
      await UpcomingContest.insertMany(newUpcomingContests);
    }

    if (oldUpcomingContests.length > 0) {
      await PastContest.insertMany(oldUpcomingContests);

      await UpcomingContest.deleteMany({
        $or: oldUpcomingContests.map((contest) => ({
          platform: contest.platform,
          name: contest.name,
          start_time: contest.start_time,
          duration: contest.duration,
        })),
      });
    }

    console.log(`Added ${newUpcomingContests.length} Upcoming contests.`);
    console.log(`Moved ${oldUpcomingContests.length} contests to PastContest.`);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
