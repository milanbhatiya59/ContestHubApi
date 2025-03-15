import { PastContest } from "../models/past-contest.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllPastContests = asyncHandler(async (req, res) => {
  const contests = await PastContest.find();
  return res
    .status(200)
    .json(new ApiResponse(200, contests, "All past contests fetched successfully"));
});

export { getAllPastContests };
