import { IDraft, IPostPreview } from "../_types";

const draftToPreview = (draft: IDraft): IPostPreview => {
  return {
    id: draft.id,
    title: draft.title,
    createdAt: draft.createdAt,
  };
};

export default draftToPreview;
