"use client";
import { useRouter } from "next/navigation";

import { root_api } from "@/app/_utils/apis";
import { jetbrains } from "@/app/_fonts";
import { useCallback, useEffect, useState, useRef } from "react";
import { addDraft } from "@/app/_utils/storage";

const Page = () => {
  const router = useRouter();

  const [editingData, setEditingData] = useState({
    title: "",
    content: "",
  });
  const timeoutRef = useRef<NodeJS.Timeout>();

  const createDraft = useCallback(() => {
    if (editingData.title.length < 2 || editingData.content.length < 2) return;
    root_api
      .post(`${process.env.NEXT_PUBLIC_API_URL}/draft/new`, editingData)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res;
          const { post_id } = data;
          addDraft({
            id: post_id,
            title: editingData.title,
            content: editingData.content,
            createdAt: new Date().toUTCString(),
            updatedAt: new Date().toUTCString(),
          });
          router.push(`/root/draft/${post_id}/edit`);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [editingData, router]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      createDraft();
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [createDraft]);

  return (
    <div className="relative pb-20">
      <div id="title" className="mb-8">
        <div className="relative border-l-2 border-t2 p-2 pl-4 text-6xl font-bold">
          <textarea
            className="z-1 placeholder:text-dim block h-16 w-full resize-none overflow-hidden bg-transparent outline-none"
            placeholder="Your title goes here..."
            value={editingData.title}
            onChange={(e) =>
              setEditingData((prev) => ({
                title: e.target.value,
                content: prev.content,
              }))
            }
          ></textarea>
        </div>
      </div>
      <div className="mt-20 rounded-lg bg-bg2" id="content">
        <textarea
          className={`block h-auto min-h-[30rem] w-full resize-y bg-transparent px-6 py-8 text-lg text-t1 outline-none ${jetbrains.className}`}
          value={editingData.content}
          onChange={(e) =>
            setEditingData((prev) => ({
              title: prev.title,
              content: e.target.value,
            }))
          }
        ></textarea>
      </div>
    </div>
  );
};

export default Page;
