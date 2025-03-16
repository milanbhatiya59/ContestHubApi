import { Router } from "express";
import {
  getAllCodechefVideos,
  getAllCodeforcesVideos,
  getAllLeetcodeVideos,
} from "../controllers/videos.controllers.js";
const router = Router();

router.route("/codeforces").get(getAllCodeforcesVideos);
router.route("/codechef").get(getAllCodechefVideos);
router.route("/leetcode").get(getAllLeetcodeVideos);

export default router;
