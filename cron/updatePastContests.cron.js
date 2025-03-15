import cron from "node-cron";
import { PastContest } from "../models/past-contest.model.js";
import { fetchPlaylistVideos } from "../services/youtube.service.js";

const processVideo = async (video) => {
  try {
    const videoId = video.contentDetails.videoId;
    const videoTitle = video.snippet.title;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const contests = await PastContest.find({ problemVideoIds: "" });

    for (const contest of contests) {
      if (contest.name.trim().toLowerCase() === videoTitle.trim().toLowerCase()) {
        contest.youtube_tutorial = videoUrl;
        await contest.save();
        console.log(`Updated contest ${contest.name} with tutorial: ${videoUrl}`);
      }
    }
  } catch (error) {
    console.error("Error processing video:", error);
  }
};

cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Fetching new YouTube videos...");
    const playlists = [
      "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB",
      "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr",
      "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr",
    ];

    for (const playlistId of playlists) {
      const videos = await fetchPlaylistVideos(playlistId);

      for (const video of videos) {
        await processVideo(video);
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
