import { UpcomingContest } from "../models/upcoming-contest.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUpcomingContests = asyncHandler(async (req, res) => {
  const contests = await UpcomingContest.find();
  res
    .status(200)
    .json(new ApiResponse(200, contests, "All upcoming contests fetched successfully"));
});

export { getAllUpcomingContests };
