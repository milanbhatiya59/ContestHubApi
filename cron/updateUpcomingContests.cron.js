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
    const newUpcomingContests = fetchedContests.filter(
      (fetched) =>
        !existingContests.some(
          (existing) =>
            existing.platform === fetched.platform &&
            existing.name === fetched.name &&
            existing.start_time === fetched.start_time &&
            existing.duration === fetched.duration
        )
    );

    if (newUpcomingContests.length > 0) {
      await UpcomingContest.insertMany(newUpcomingContests);
      console.log(`Added ${newUpcomingContests.length} new upcoming contests.`);
    }

    const currentTimeIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const upcomingContests = await UpcomingContest.find();
    const finishedContests = upcomingContests.filter((contest) => {
      const contestStart = new Date(contest.start_time);
      const contestEnd = new Date(contestStart.getTime() + contest.duration * 60000);
      return contestEnd < currentTimeIST;
    });

    if (finishedContests.length > 0) {
      await PastContest.insertMany(finishedContests);
      await UpcomingContest.deleteMany({
        _id: { $in: finishedContests.map((contest) => contest._id) },
      });
      console.log(`Moved ${finishedContests.length} contests to PastContest.`);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
