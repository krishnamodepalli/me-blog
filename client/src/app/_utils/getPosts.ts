import { api } from "./apis";

import { IPost, IPostPreview } from "../_types";

export const getPost = async (uuid: string): Promise<IPost> => {
  const { data } = await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${uuid}`,
  );
  return data as IPost;
};

const getAllPosts = async (): Promise<IPostPreview[]> => {
  const { data } = await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}/post/all`,
    {
      params: {
        page_no: 1,
        limit: Number.MAX_SAFE_INTEGER,
      },
    },
  );
  const posts = data.posts as IPostPreview[];
  return posts;
};

export default getAllPosts;
