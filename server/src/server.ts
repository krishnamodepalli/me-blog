import express from "express";
import CORS from "cors";

import { Post, sync } from "./models";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import draftRouter from "./routes/draft";
import sequelize from "./sequelize";
import authMiddleware from "./middleware/auth";

const app = express();

const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(CORS());

// routes
app.use("/auth", authRouter);
app.use("/draft", authMiddleware, draftRouter);
app.use("/post", authMiddleware, postRouter);

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
