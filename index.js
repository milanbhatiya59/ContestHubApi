import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import { PORT } from "./constants.js";

app.listen(PORT || 8000, () => {
  console.log(`⚙️ Server is running at : http://localhost:${PORT}`);
});
