import cron from "node-cron";
import { PastContest } from "../models/past-contest.model.js";
import { UpcomingContest } from "../models/upcoming-contest.model.js";
import { fetchCurrentAndUpcomingCodechefContests } from "../services/codechef.service.js";
import { fetchCurrentAndUpcomingCodeforcesContests } from "../services/codeforces.service.js";
import { fetchCurrentAndUpcomingLeetCodeContests } from "../services/leetcode.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

cron.schedule(
  "*/10 * * * *",
  asyncHandler(async () => {
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
        new Date(contestA.start_time).getTime() === new Date(contestB.start_time).getTime() &&
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
      const oldUpcomingContestsWithYoutubeField = oldUpcomingContests.map((contest) => ({
        ...contest,
        youtube_tutorial: "",
      }));

      await PastContest.insertMany(oldUpcomingContestsWithYoutubeField);

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
  })
);
