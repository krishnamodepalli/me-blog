import { Router, Request, Response } from "express";

import { client } from "../lib/db";
import { Draft } from "../models";
import {
  RCasual,
  RGAllDrafts,
  RGDraft,
  RGDraftUpdatedAt,
  RPNewDraft,
} from "../types/response";
import { IDraft, IDraftContents, IDraftPreview } from "../types";
import { addDraft, getDraft, updateDraft, deleteDraft } from "../utils/redis";

const router = Router();

/**
 * What we do with drafts:
 *  1. Creating a new draft
 *  2. Publish the draft as a post
 *  3. Update the draft with new content
 *  4. Delete a draft
 */

router.get("/all", async (req: Request, res: Response<RGAllDrafts>) => {
  try {
    const result = (await Draft.findAll({
      attributes: ["id", "title", "createdAt"],
    })) as unknown as IDraftPreview[];

    res.status(200).json({
      msg: "Successfully fetched all the drafts",
      drafts: result,
    });
  } catch (err) {
    console.error("Error while fetching drafts.\n" + err);
  }
});

router.get("/:uuid", async (req: Request, res: Response<RGDraft>) => {
  const UUID = req.params.uuid as string;
  // try to get the draft from REDIS
  const draft = await getDraft(UUID);
  if (draft)
    res.status(200).json({ msg: "OK", draft });
  else {
    // get the draft from database and add it to REDIS
    try {
      const draft = await Draft.findByPk(UUID);
      if (!draft) {
        res.status(404).json({ msg: `Cannot find the draft with id ${UUID}` });
        return;
      }
      const { id, title, content, createdAt, updatedAt } = draft.dataValues;
      const data = { id, title, content, createdAt, updatedAt } as IDraft;
      const status = await addDraft(data);

      res.status(200).json({ msg: "OK", draft: data });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Unable to fetch draft, please try again later. " });
      console.error("Error while fetching a draft from database\n" + error);
    }
  }

  // try {
  // } catch (error) {
  //   // if not found in redis, check for database
  //   try {
  //     const draft = (await Draft.findByPk(UUID)) as Draft;
  //     const { title, content, createdAt } = draft.dataValues;
  //
  //     await client.hset(`draft_key:${UUID}`, {
  //       createdAt,
  //       updatedAt: new Date().toUTCString(),
  //     });
  //     await client.hset(`draft:${UUID}`, { title, content });
  //     res.status(200).json({ msg: "OK", draft: { title, content } });
  //   } catch (e) {
  //     res.status(404).json({ msg: "Draft not found" });
  //   }
  //   res
  //     .status(500)
  //     .json({ msg: "Unable to fetch draft, please try again later. " });
  //   console.error("Error while sending a draft on GET request");
  // }
});

router.get(
  "/:uuid/updatedAt",
  async (req: Request, res: Response<RGDraftUpdatedAt>) => {
    const UUID = req.params.uuid as string;
    try {
      const result = await client.hgetall(`draft_key:${UUID}`);
      res.status(200).json({ msg: "OK", updatedAt: result.updatedAt });
    } catch (error) {
      try {
        const result = await Draft.findByPk(UUID, {
          attributes: ["updatedAt"],
        });
        if (result)
        res
          .status(200)
          .json({ msg: "OK", updatedAt: result.dataValues.updatedAt });
        else res.status(404).json({ msg: `No draft exists with id ${UUID}.` });
      } catch (error) {
        console.error(error);
      }
      console.error(error);
    }
  },
);

// creating a new draft
// We will never create a new post, we only create a draft
router.post("/new", async (req: Request, res: Response<RPNewDraft>) => {
  // get the data
  const { title, content } = req.body as {
    title: string;
    content: string;
  };

  /**
   * Create a new key `draft_key:${uuid}` which only checks if we still have
   * the draft in the redis cache database. This will have an expiration.
   *
   * We store the data inside another key, `draft:${uuid}`.
   *
   * The `draft_key:${uuid}` on expiration will delete the `draft:${uuid}`
   */
  try {
    const draft = (await Draft.create({ title, content })) as Draft;
    const uuid = draft.dataValues.id as string;

    // create a draft_key and also a draft
    try {
      await client.hset(`draft_key:${uuid}`, {
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      });
      await client.hset(`draft:${uuid}`, {
        title,
        content,
      });
      await client.expire(`draft_key:${uuid}`, 3600);
      res
        .status(200)
        .json({ msg: "Successfully created the draft.", post_id: uuid });
    } catch (e) {
      await draft.destroy();
      res.status(500).json({
        msg: "System has encountered some error, please try again later",
      });
      console.error("Cannot create draft in the REDIS cache database.\n", e);
    }
  } catch (e) {
    res.status(500).json({
      msg: "System has encountered some error, please try again later",
    });
    console.error("Cannot create draft in the database:\n", e);
  }
});

// publish a draft
router.post("/publish/:uuid", async (req: Request, res: Response<RCasual>) => {
  const UUID = req.params.uuid as string;

  const redis_draft = await getDraft(UUID);
  const database_draft = await Draft.findByPk(UUID);
  if (redis_draft && database_draft) {
    try {
      await database_draft.convertToPost();
      await deleteDraft(UUID);
      res.status(200).json({ msg: "Successfully published the post." });
    } catch (error) {
      res.status(500).json({ msg: "Cannot publish the draft!! Please try again later" });
      console.error("Cannot publish the draft.\n" + error);
    }
  }
});

// update an existing draft
router.put("/:uuid", async (req: Request, res: Response<RCasual>) => {
  /**
   * 1. Get the data to update
   * 2. Check if draft is still in redis
   *    - If yes, just update over there
   *    - If not, fetch the draft from database and bring it to redis
   */

    // first find the post to be updated
  const UUID = req.params.uuid as string;
  const newTitle = req.body.title as string;
  const newContent = req.body.content as string;

  const status = await updateDraft(UUID, {
    title: newTitle,
    content: newContent,
  });
  if (status) {
    res.status(200).json({ msg: "OK" });
  } else {
    res.status(500).json({ msg: "Cannot update the draft!!" });
  }
});

// delete a draft
router.delete("/:uuid", async (req: Request, res: Response<RCasual>) => {
  // first find the post to be deleted
  const UUID: string = req.params.uuid as string;

  const status = await deleteDraft(UUID);
  if (status) {
    try {
      const draft = await Draft.findByPk(UUID);
      if (draft) await draft.destroy();
      res.status(200).json({ msg: "OK" });
    } catch (error) {
      console.error("Cannot delete the draft\n" + error);
      res.status(500).json({ msg: "Cannot delete the draft!!" });
    }
  }
});

export default router;
