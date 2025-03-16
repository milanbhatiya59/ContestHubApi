import { fetchPlaylistVideos } from "../services/youtube.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCodeforcesVideos = asyncHandler(async (req, res) => {
  const videos = await fetchPlaylistVideos("PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB");
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Codeforces videos fetched successfully"));
});

const getAllCodechefVideos = asyncHandler(async (req, res) => {
  const videos = await fetchPlaylistVideos("PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr");
  return res.status(200).json(new ApiResponse(200, videos, "CodeChef videos fetched successfully"));
});

const getAllLeetcodeVideos = asyncHandler(async (req, res) => {
  const videos = await fetchPlaylistVideos("PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr");
  return res.status(200).json(new ApiResponse(200, videos, "LeetCode videos fetched successfully"));
});

export { getAllCodechefVideos, getAllCodeforcesVideos, getAllLeetcodeVideos };
