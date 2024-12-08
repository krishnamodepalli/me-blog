import {
  IDraft,
  IDraftDetails,
  IDraftLS,
  IDraftPreview,
  IDraftsLS,
  IPostPreview,
} from "../_types";
import draftToPreview from "./draftToPreview";

/**
 * This will check if the localStorage have a draft with the given id
 * @param id The id of the draft to check for availability
 */
const isDraftAvailable = (id: string): boolean => {
  const data = JSON.parse(
    localStorage.getItem(`draft:${id}`) as string,
  ) as IDraftLS;

  return !!data;
};

/**
 * To add a new draft to localStorage.
 *
 * Adds the draft to `draft:${id}` as well as `drafts`
 * @param draft The draft to add into localStorage
 */
const addDraft = (draft: IDraft) => {
  const post_uuid: string = draft.id;

  if (isDraftAvailable(post_uuid))  return;

  // Adding `draft:${id}` to localStorage
  localStorage.setItem(
    `draft:${post_uuid}`,
    JSON.stringify({
      draft: {
        title: draft.title,
        content: draft.content,
      } as IDraftDetails,
      updatedAt: new Date().toUTCString(),
      fetchedAt: new Date().toUTCString(),
    } as IDraftLS),
  );

  // updating the `drafts` in localStorage
  const allDrafts = JSON.parse(
    localStorage.getItem("drafts") as string,
  ) as IDraftsLS;

  if (allDrafts)
    allDrafts.drafts.push({
      ...draft,
    } as IDraftPreview);

  localStorage.setItem(
    "drafts",
    JSON.stringify({
      drafts: allDrafts.drafts || [draftToPreview(draft)],
      // using the old data, we didn't fetch anything.
      fetchedAt: allDrafts.fetchedAt,
    } as IDraftsLS),
  );
};

/**
 * To remove a draft from localStorage with corresponding `id`
 * @param id Id of the draft to remove from localStorage
 */
const removeDraft = (id: string) => {
  if (!isDraftAvailable(id))  return;

  localStorage.removeItem(`draft:${id}`);
  const allDrafts = JSON.parse(
    localStorage.getItem("drafts") as string,
  ) as IDraftsLS;

  allDrafts.drafts.filter((draft) => draft.id !== id);
  localStorage.setItem(
    "drafts",
    JSON.stringify({
      drafts: allDrafts,
      fetchedAt: allDrafts.fetchedAt,
    }),
  );
};

/**
 * To retrieve a draft from localStorage
 * @param id Id of the draft to retrieve from localStorage
 * @returns draft of type `IDraftLS`
 */
const getDraft = (id: string): IDraftLS | null => {
  return JSON.parse(localStorage.getItem(`draft:${id}`) as string) as IDraftLS;
};

/**
 * gets all the draft previews present in `drafts` in localStorage
 * @returns IDraftsLS
 */
const getDraftPreviews = (): IDraftsLS | null => {
  return JSON.parse(localStorage.getItem("drafts") as string) as IDraftsLS;
};

/**
 * Updates the draft in localStorage.
 *
 * Updates in both `draft:${id}` & `drafts`
 * @param id Id of the draft to update
 * @param draftDetails Details (title, content) to update in the draft
 */
const updateDraft = (id: string, draftDetails: IDraftDetails) => {
  // this should make sure, that the draft is already present in the localStorage
  const localDraft = getDraft(id);
  if (!localDraft) return;

  localDraft.draft = draftDetails as IDraftDetails;

  localStorage.setItem(
    `draft:${id}`,
    JSON.stringify({
      draft: draftDetails,
      fetchedAt: localDraft.fetchedAt,
      updatedAt: new Date().toUTCString(),
    } as IDraftLS),
  );
  const allDrafts = JSON.parse(
    localStorage.getItem("drafts") as string,
  ) as IDraftsLS;
  allDrafts.drafts.map((draft) => {
    if (draft.id === id) {
      draft.title = draftDetails.title;
    }
    return draft;
  });
  localStorage.setItem("drafts", JSON.stringify(allDrafts));
};

/**
 * To set the drafts into localStorage to `drafts`
 * @param draftPreviews The drafts to set into `drafts` in localStorage
 * @param fetchedAt Time at which they are fetched at
 */
const setDraftPreviews = (draftPreviews: IPostPreview[], fetchedAt: Date) => {
  localStorage.setItem(
    "drafts",
    JSON.stringify({
      drafts: draftPreviews,
      fetchedAt: fetchedAt.toUTCString(),
    } as IDraftsLS),
  );
};

export {
  isDraftAvailable,
  addDraft,
  removeDraft,
  getDraft,
  getDraftPreviews,
  updateDraft,
  setDraftPreviews,
};
