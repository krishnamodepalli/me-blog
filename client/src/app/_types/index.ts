import { SetStateAction } from "react";

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

export interface IDraftDetails {
  title: string;
  content: string;
}

export interface IDraftLS {
  draft: IDraftDetails;
  updatedAt: string;
  fetchedAt: string;
}

export interface IDraftsLS {
  drafts: IPostPreview[];
  fetchedAt: string;
}

type rstate<T> = [state: T, setState: React.Dispatch<SetStateAction<T>>];
type rref<T> = React.MutableRefObject<T>;

export type { IPost as IDraft };
export type { IPostPreview as IDraftPreview };

export type { rstate, rref };
