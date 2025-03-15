import { Router } from "express";
import { getAllPastContests } from "../controllers/past-contests.controllers.js";

const router = Router();

router.route("/").get(getAllPastContests);

export default router;
