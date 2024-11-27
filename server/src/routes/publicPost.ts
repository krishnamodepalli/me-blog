import { Router, Request, Response } from "express";

import { client } from "../lib/db";
import { Post } from "../models";

const router = Router();

// These are the public routes for posts.

/**
 * What we do with posts:
 *  1. Get all posts
 *  2. Get a post
 */

// get some posts
router.get("/all", async (req: Request, res: Response) => {
  const page_no = parseInt((req.query.page_no || "1") as string);
  const limit = parseInt((req.query.limit || "5") as string);
  const posts = await Post.findAll({
    attributes: ["id", "title", "createdAt"],
    limit,
    offset: page_no - 1,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    posts: posts.map((post) => post.dataValues),
  });
});

// get the post with uuid
router.get("/:uuid", async (req: Request, res: Response) => {
  const uuid: string = req.params.uuid as string;

  try {
    const post = await client.hgetall(`posts:${uuid}`);
    console.log("Fetching from redis.");
    if (Object.keys(post).length !== 0) {
      res.status(200).json({ ...post });
      return;
    }
  } catch (error) {
    console.error("Unable to fetch data from redis");
  }

  // find the database
  const post = (await Post.findByPk(uuid)) as Post;
  if (!post) {
    res.status(404).json({
      msg: "Post not found.",
    });
    return;
  }

  res.status(200).json({
    post: post.dataValues,
  });
  await client.hset(`posts:${uuid}`, post.dataValues);
  await client.expire(`posts:${uuid}`, 3600);
});

export default router;
