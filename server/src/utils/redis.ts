import { IDraft, IDraftContents } from "../types";
import { client } from "../lib/db";

type IDraftDetails = {
  createdAt: string;
  updatedAt: string;
}

/**
 * To get a draft from REDIS client
 * @param id The id of draft to get from the REDIS client
 * @return IDraft
 */
const getDraft = async (id: string): Promise<IDraft | null> => {
  try {
    const draftContents = await client.hgetall(`draft:${id}`) as unknown as IDraftContents;
    const draftDetails = await client.hgetall(`draft_key:${id}`) as IDraftDetails;
    if (Object.keys(draftDetails).length > 0 && Object.keys(draftContents).length > 0) {
      return {
        id,
        ...draftContents,
        ...draftDetails,
      } as IDraft;
    }
    return null;
  } catch (error) {
    console.warn(`Cannot get draft with id ${id} from REDIS client!!!\n`, error);
    return null;
  }
};

/**
 * To add a new draft into the REDIS client
 * @param draft The draft to add into the REDIS client
 * @return boolean
 */
const addDraft = async (draft: IDraft): Promise<boolean> => {
  const { id, title, content, createdAt, updatedAt } = draft;

  try {
    client.hset(`draft_key:${id}`, { createdAt, updatedAt });
    client.hset(`draft:${id}`, { title, content });
    await client.expire(`draft_key:${id}`, 3600);
    return true;
  } catch (error) {
    // delete if anything is created
    try {
      client.del(`draft_key:${id}`);
      client.del(`draft:${id}`);
    } catch (_) {
    } // ignore this error
  }
  return false;
};

const updateDraft = async (id: string, draftContents: IDraftContents): Promise<boolean> => {
  const draft_key = `draft_key:${id}`;
  const draft_ = `draft:${id}`;

  const { title, content } = draftContents;
  try {
    const createdAt = await client.hget(`draft_key:${id}`, "createdAt");
    if (!createdAt) {
      // no draft exists in the REDIS, this could be an error
      console.error(`No draft exists with id ${id}, No drafts updated.`);
      return false;
    }
    await client.hset(draft_key, { createdAt, updatedAt: new Date().toUTCString() } as IDraftDetails);
    await client.hset(draft_, { title, content });
    await client.expire(draft_key, 3600);
    return true;
  } catch (error) {
    console.error("Cannot update the draft!!\n" + error);
  }

  return false;
};

/**
 * To delete a draft from REDIS client
 * @param id The id of draft to delete from the REDIS client
 * @return boolean
 */
const deleteDraft = async (id: string): Promise<boolean> => {
  try {
    await client.del(`draft_key:${id}`);
    await client.del(`draft:${id}`);
    return true;
  } catch (error) {
  } // ignore this error

  return false;
};

export {
  getDraft,
  addDraft,
  updateDraft,
  deleteDraft,
};
