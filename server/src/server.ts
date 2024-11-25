import express from "express";
import CORS from "cors";

import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import publicPostRouter from "./routes/publicPost";
import draftRouter from "./routes/draft";
import statsRouter from "./routes/stats";

import sequelize from "./sequelize";
import authMiddleware from "./middleware/auth";

const app = express();

const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(CORS());

// routes
app.use("/auth", authRouter);
app.use("/post", publicPostRouter);
app.use("/draft", authMiddleware, draftRouter);
app.use("/post", authMiddleware, postRouter);
app.use("/api", statsRouter);

app.listen(port, async () => {
  console.log("Server is fired up and running on port " + port);

  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the database");
    // sync();
  } catch (error) {
    console.error("Unable to connect to the database.\n" + error);
  }
});
