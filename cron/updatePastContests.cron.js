import cron from "node-cron";
import { PastContest } from "../models/past-contest.model.js";
import { fetchPlaylistVideos } from "../services/youtube.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const processVideo = async (video) => {
  const videoId = video.contentDetails.videoId;
  const videoTitle = video.snippet.title;
  const publishedAt = new Date(video.snippet.publishedAt);

  const contest = await PastContest.find({
    $or: [{ problemVideoIds: "" }, { solutionVideoIds: undefined }],
  });
};

cron.schedule(
  "*/30 * * * *",
  asyncHandler(async () => {
    console.log("Fetching new YouTube videos...");
    const playlists = [
      "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB",
      "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr",
      "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr",
    ];

    for (const playlistId of playlists) {
      const videos = await fetchPlaylistVideos(playlistId);
      videos.forEach((video) => processVideo(video));
    }
  })
);
