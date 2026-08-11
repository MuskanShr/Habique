import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { dbConnect } from "./config/db.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

dbConnect();

app.use("/api/v1/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
