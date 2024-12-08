export interface IPostPreview {
  id: string;
  title: string;
  createdAt: string;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type { IPost as IDraft };
export type { IPostPreview as IDraftPreview };

export interface IDraftContents {
  title: string;
  content: string;
}

export interface IDraftLS {
  draft: IDraftContents;
  updatedAt: string;
  fetchedAt: string;
}

export interface IDraftsLS {
  drafts: IPostPreview[];
  fetchedAt: string;
}
