import mongoose, { Schema } from "mongoose";

const upcomingContestSchema = new Schema({
  platform: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  youtube_tutorial: {
    type: String,
  },
  url: {
    type: String,
  },
});

export const UpcomingContest = mongoose.model("UpcomingContest", upcomingContestSchema);
