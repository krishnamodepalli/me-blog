import { Router, Request, Response } from "express";

import { client } from "../lib/db";
import { Draft } from "../models";

const router = Router();

/**
 * What we do with drafts:
 *  1. Creating a new draft
 *  2. Publish the draft as a post
 *  3. Update the draft with new content
 *  4. Delete a draft
 */

router.get("/all", async (req: Request, res: Response) => {
  try {
    const result = (await Draft.findAll({
      attributes: ["id", "title", "createdAt"],
    })) as Draft[];
    res.status(200).json({
      msg: "Successfully fetched all the drafts",
      drafts: result,
    });
  } catch (err) {
    console.error("Error while fetching drafts.\n" + err);
  }
});

router.get("/:uuid", async (req: Request, res: Response) => {
  const UUID = req.params.uuid as string;
  try {
    const result = await client.hgetall(`drafts:${UUID}`);
    console.log("fetching from redis...");
    res.status(200).json({ msg: "OK", draft: result });
  } catch (error) {
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
    console.error("Error while sending a draft on GET request");
  }
});

// creating a new draft
// We will never create a new post, we only create a draft
router.post("/new", async (req: Request, res: Response) => {
  // get the data
  const { title, content } = req.body as {
    title: string;
    content: string;
  };

  try {
    const draft = (await Draft.create({ title, content })) as Draft;
    const uuid = draft.dataValues.id as string;

    await client.hset(`drafts:${uuid}`, {
      title: title,
      content: content,
    });
    res.status(200).json({
      msg: "Draft created successfully",
      post_id: draft.dataValues.id,
    });
  } catch (e) {
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
    console.error("Error while creating a new Draft\n" + e);
  }
});

// publish a draft
router.post("/publish/:uuid", async (req: Request, res: Response) => {
  const uuid = req.params.uuid as string;

  // find the draft and then convert it into a post
  // get the latest data from the redis server
  const redisDraft = await client.hgetall(`drafts:${uuid}`);
  const draft = (await Draft.findByPk(uuid)) as Draft;

  if (redisDraft)
    // update the draft with latest data
    await draft.update({
      title: redisDraft.title,
      content: redisDraft.content,
    });

  try {
    await draft.convertToPost();
    res.status(200).json({ msg: "Successfully published the post." });
    // after this, we need to delete the draft from redis
    await client.del(`drafts:${uuid}`);
  } catch (e) {
    res
      .status(500)
      .json({ msg: "Cannot publish the post. Please try again later." });
  }
});

// update an existing draft
router.put("/:uuid", async (req: Request, res: Response) => {
  // first find the post to be updated
  const UUID = req.params.uuid as string;
  const newTitle = req.body.title as string;
  const newContent = req.body.content as string;

  // first we need to connect to the `redis` and check if redis already have this draft.
  const redis_res = await client.hset(`drafts:${UUID}`, {
    title: newTitle,
    content: newContent,
  });
  if (redis_res === 0) {
    // there exists the draft and we successfully updated in the redis server
    res.status(200).json({ msg: "content is updated" });
    return;
  }
  // if not, (there is possibility for this case... BUT STILL)

  const draft = (await Draft.findByPk(UUID)) as Draft;
  if (!draft) {
    res.status(404).json({
      msg: "Cannot find the post to delete",
    });
    return;
  }

  try {
    draft.update({ content: newContent }); // no need to call `save()`
    res.status(200).json({ msg: "content is updated" });
  } catch (err) {
    console.error("An error occurred while updating a draft\n" + err);
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
  }
});

// delete a draft
router.delete("/:uuid", async (req: Request, res: Response) => {
  // first find the post to be deleted
  const UUID: string = req.params.uuid as string;

  const draft = await Draft.findByPk(UUID);
  if (!draft) {
    res.status(200).json({ msg: "Successfully deleted the draft." });
    return;
  }

  try {
    draft?.destroy();
    res.status(200).json({ msg: "Successfully deleted the draft." });
  } catch (err) {
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
  }
});

export default router;