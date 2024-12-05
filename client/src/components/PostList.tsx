// components/PostList.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

import Each from "./utils/Each";

import formatDate from "@/app/_utils/formatDate";
import { IPostPreview } from "@/app/_types";
import { montserrat } from "@/app/_fonts";
import { api } from "@/app/_utils/apis";
import myMDParser from "@/app/_utils/markParser";

const PostPreview = ({
  id,
  title,
  createdAt,
}: {
  id: string;
  title: string;
  createdAt: string;
}) => {
  const date = formatDate(new Date(createdAt));

  return (
    <div className="my-2 rounded-lg bg-bg2 px-8 py-6">
      <Link href={`/post/${id}`}>
        <h2
          className="my-1 text-xl font-semibold tracking-wider"
          dangerouslySetInnerHTML={{
            __html: myMDParser.parseInline(title) || "",
          }}
        ></h2>
      </Link>
      <span className={`${montserrat.className} italic tracking-wider text-t2`}>
        {date}
      </span>
    </div>
  );
};

const PostList = () => {
  const [posts, setPosts] = useState<IPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNumber: number) => {
    const { data } = await api.get("/post/all", {
      params: {
        page_no: pageNumber,
        limit: 1,
      },
    });
    return data.posts;
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const newPosts = (await fetchPosts(page)) as IPostPreview[];
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length > 0);
      setLoading(false);
    };

    loadPosts();
  }, [page, fetchPosts]);

  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="box-border w-full animate-pulse rounded-lg bg-bg2 p-8">
          <span className="inline-block h-10 w-7/12 animate-pulse rounded-lg bg-bg3"></span>
          <ul>
            {
              <Each
                of={[0, 1]}
                render={(_, index) => (
                  <li
                    className="my-2 h-4 w-10/12 animate-pulse rounded-md bg-bg3"
                    key={index}
                  ></li>
                )}
              />
            }
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Each
        of={posts}
        render={(item, index) => (
          <PostPreview
            id={item.id}
            key={index}
            title={item.title}
            createdAt={item.createdAt}
          />
        )}
      />

      {loading && page > 1 && (
        <div className="box-border w-full animate-pulse rounded-lg bg-bg2 p-8">
          <span className="inline-block h-10 w-7/12 animate-pulse rounded-lg bg-bg3"></span>
          <ul>
            {
              <Each
                of={[0, 1]}
                render={(_, index) => (
                  <li
                    className="my-2 h-4 w-10/12 animate-pulse rounded-md bg-bg3"
                    key={index}
                  ></li>
                )}
              />
            }
          </ul>
        </div>
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default PostList;
