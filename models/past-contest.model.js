import { mongoose, Schema } from "mongoose";

const pastContestSchema = new Schema({
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

export const PastContest = mongoose.model("PastContest", pastContestSchema);
