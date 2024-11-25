import { Router, Request, Response } from "express";

import { Post } from "../models";

const router = Router();

router.get("/stats", async (req: Request, res: Response) => {
  const no_of_posts: number = (await Post.findAll()).length;
  const last_post = await Post.findOne({
    order: [["updatedAt", "DESC"]],
  });

  res.status(200).json({
    posts_count: no_of_posts,
    last_activity: last_post?.dataValues.updatedAt,
  });
});

export default router;
