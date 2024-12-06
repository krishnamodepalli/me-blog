"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { redirect } from "@/app/_hooks/useRedirectInNSec";
import { root_api } from "@/app/_utils/apis";
import myMDParser from "@/app/_utils/markParser";

import "highlight.js/styles/github-dark.min.css";
import { getDraft } from "@/app/_utils/storage";

const Page = ({ params }: { params: { post_uuid: string } }) => {
  const { post_uuid } = params;
  const path = usePathname();

  const [loading, setLoading] = useState<boolean>(true);

  const blogContentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<{
    title: string;
    content: string;
  }>({
    title: "",
    content: "",
  });

  // Get the draft from localStorage
  useEffect(() => {
    setLoading(true);
    const data = getDraft(post_uuid);
    if (!data) return;
    const { draft } = data;

    setEditingData({
      title: draft.title,
      content: draft.content,
    });
  }, [post_uuid]);

  // render the draft data from localStorage
  useEffect(() => {
    const html = myMDParser.parse(editingData.content || "") as string;
    const blogContentDiv = blogContentRef.current;
    if (blogContentDiv) blogContentDiv.innerHTML = html;
    setLoading(false);
  }, [editingData]);

  const publishPost = useCallback(() => {
    setIsLoading(true);
    root_api
      .post(`/draft/publish/${post_uuid}`, {})
      .then(() => {
        toast.success("Your draft is successfully published.", {
          theme: "colored",
          autoClose: 3000,
        });
        if (redirect) redirect(3, "/");
      })
      .catch((err) => {
        toast.error("Cannot publish the draft. Please try again later.", {
          theme: "colored",
          autoClose: 5000,
        });
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, [post_uuid]);

  if (loading)
    return (
      <div className="my-20 animate-pulse">
        <p className="mb-8 h-20 rounded-md bg-bg2"></p>
        <div className="mb-8 flex justify-end">
          <p className="h-12 w-40 rounded-md bg-bg2"></p>
        </div>
        <div className="my-8">
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="h-5 w-[80%] rounded-sm bg-bg2"></p>
        </div>
        <div className="my-8">
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="h-5 w-[80%] rounded-sm bg-bg2"></p>
        </div>
        <div className="my-8">
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="mb-2 h-5 rounded-sm bg-bg2"></p>
          <p className="h-5 w-[80%] rounded-sm bg-bg2"></p>
        </div>
        <p className="h-12 w-full bg-bg2"></p>
      </div>
    );

  return (
    <div className="mb-40">
      <div id="title" className="mb-8">
        <div className="relative border-l-2 border-t2 p-2 pl-4 text-6xl font-bold">
          <p
            className="z-1 text-t1 outline-none"
            dangerouslySetInnerHTML={{
              __html: editingData.title,
            }}
          ></p>
        </div>
      </div>
      <div className="my-4 flex justify-end">
        <Link
          href={`${path}/edit`}
          className="flex h-12 w-48 items-center justify-center gap-3 rounded-md bg-primary text-xl font-semibold text-bg1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            className="inline-block fill-bg1"
            width={24}
          >
            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
          </svg>
          Edit
        </Link>
      </div>
      <div ref={blogContentRef} className="my-8" id="blog-content"></div>
      <button
        disabled={isLoading}
        className="w-full rounded-none bg-primary py-4 text-2xl text-bg1"
        onClick={publishPost}
      >
        Publish
      </button>
    </div>
  );
};

export default Page;
