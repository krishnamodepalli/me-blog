import { Router, Request, Response } from "express";

import { Post } from "../models";

const router = Router();

/**
 * What we do with posts:
 *  1. Delete a post
 */

// delete an existing post
router.delete("/:uuid", async (req: Request, res: Response) => {
  // first find the post to be deleted
  const UUID: string = req.params.uuid as string;

  const post = await Post.findByPk(UUID);
  if (!post) {
    res.status(200).json({ msg: "Successfully deleted the post." });
    return;
  }

  try {
    post.destroy();
    res.status(200).json({ msg: "Successfully deleted the post." });
  } catch (err) {
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
  }
});

export default router;
