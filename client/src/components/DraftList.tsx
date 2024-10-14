// components/DraftList.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { Tooltip } from "react-tooltip";

import Each from "./Each";

import formatDate from "@/app/_utils/formatDate";
import { IPostPreview } from "@/app/_types";
import axios from "axios";
import { toast } from "react-toastify";

const PostPreview = ({
  id,
  title,
  createdAt,
  posts,
  setPosts,
}: {
  id: string;
  title: string;
  createdAt: string;
  posts: IPostPreview[];
  setPosts: React.Dispatch<React.SetStateAction<IPostPreview[]>>;
}) => {
  const date = formatDate(new Date(createdAt));
  const token = Cookies.get("token") as string;

  const handleDeleteDraft = useCallback(() => {
    const deletedPost = posts.find((post) => post.id === id) as IPostPreview;
    setPosts((prev) => prev.filter((post) => post.id !== id));

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/draft/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        console.error("Cannot delete post", err);
        toast.error("Cannot delete the draft.", {
          theme: "colored",
        });
        setPosts((prev) => [...prev, deletedPost]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id, setPosts]);

  return (
    <div className="relative mb-4 flex w-full overflow-hidden rounded-lg bg-dim">
      <Link href={`/root/draft/${id}`} className="w-full px-8 py-4">
        <h2 className="my-2 text-3xl font-semibold tracking-wider">
          {title || "Untitled.."}
        </h2>
        <span className="italic text-ts">{date}</span>
      </Link>
      <div
        onClick={handleDeleteDraft}
        className="draft-trash-can hover:bg-sbackg group flex cursor-pointer items-center px-4 transition-all duration-150"
        data-tooltip-variant="error"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="fill-ts group-hover:fill-[#d62828]"
          width={24}
        >
          <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </div>
    </div>
  );
};

const LoadingDraft = () => (
  <div className="box-border w-full animate-pulse rounded-lg bg-neutral-800 p-8">
    <span className="inline-block h-10 w-7/12 animate-pulse rounded-lg bg-neutral-700"></span>
    <ul>
      {
        <Each
          of={[0, 1]}
          render={(_, index) => (
            <li
              className="my-2 h-4 w-10/12 animate-pulse rounded-md bg-neutral-700"
              key={index}
            ></li>
          )}
        />
      }
    </ul>
  </div>
);

const DraftList = () => {
  const token = Cookies.get("token") as string;

  const [posts, setPosts] = useState<IPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/draft/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data.drafts as IPostPreview[];
  }, [token]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const newPosts = (await fetchDrafts()) as IPostPreview[];
      setPosts(newPosts);
      setLoading(false);
    };

    loadPosts();
  }, [fetchDrafts]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Each
          of={[0, 1, 2]}
          render={(_, index) => <LoadingDraft key={index} />}
        />
      </div>
    );
  }

  return (
    <div>
      <Each
        of={posts || []}
        render={(item, index) => (
          <PostPreview
            key={index}
            id={item.id}
            title={item.title}
            createdAt={item.createdAt}
            posts={posts}
            setPosts={setPosts}
          />
        )}
      />
      <Tooltip anchorSelect=".draft-trash-can" content="Delete draft" />
    </div>
  );
};

export default DraftList;
