import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { CORS_ORIGIN } from "./constants.js";

const app = express();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import pastContestsRoutes from "./routes/past-contests.routes.js";
import upcomingContestsRoutes from "./routes/upcoming-contests.routes.js";
import videosRoutes from "./routes/videos.routes.js";

//routes declaration
app.use("/api/v1/past-contests", pastContestsRoutes);
app.use("/api/v1/upcoming-contests", upcomingContestsRoutes);
app.use("/api/v1/videos", videosRoutes);

export { app };
