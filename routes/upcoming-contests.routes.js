import { Router } from "express";
import { getAllUpcomingContests } from "../controllers/upcoming-contests.controllers.js";

const router = Router();

router.route("/").get(getAllUpcomingContests);

export default router;
