import { IDraft, IPost, IPostPreview } from ".";

export interface RCasual {
  msg: string;
}

export interface RGAllDrafts {
  msg: string;
  drafts?: IPostPreview[];
}

export interface RGDraft {
  msg: string;
  draft?: IDraft;
}

export interface RGPost {
  msg: string;
  post?: IPost;
}

export interface RGDraftUpdatedAt {
  msg: string;
  updatedAt?: string;
}

export interface RPNewDraft {
  msg: string;
  post_id?: string;
}
