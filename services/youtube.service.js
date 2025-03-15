import { google } from "googleapis";
import { GOOGLE_API_KEY } from "../constants.js";

const youtube = google.youtube({
  version: "v3",
  auth: GOOGLE_API_KEY,
});

async function fetchPlaylistVideos(playlistId) {
  let videos = [];
  let nextPageToken = null;

  try {
    do {
      const response = await youtube.playlistItems.list({
        part: "snippet,contentDetails",
        maxResults: 50,
        playlistId: playlistId,
        pageToken: nextPageToken,
      });

      videos = videos.concat(response.data.items);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken && videos.length < 200);

    return videos;
  } catch (error) {
    console.error("Error fetching playlist videos:", error);
    return [];
  }
}

export { fetchPlaylistVideos };
