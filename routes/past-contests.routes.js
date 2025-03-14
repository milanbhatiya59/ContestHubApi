import { Router } from "express";

const router = Router();

router.route("/codeforces").get();
router.route("/codechef").get();
router.route("/leetcode").get();

export default router;
