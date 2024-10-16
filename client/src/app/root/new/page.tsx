"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

import { jetbrains } from "@/app/_fonts";
import { useCallback, useEffect, useState, useRef } from "react";

const Page = () => {
  const router = useRouter();

  const token = Cookies.get("token") as string;

  const [editingData, setEditingData] = useState({
    title: "",
    content: "",
  });
  const timeoutRef = useRef<NodeJS.Timeout>();

  const createDraft = useCallback(() => {
    if (!editingData.title && !editingData.content) return;
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/draft/new`, editingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const { data } = res;
          const { post_id } = data;
          router.push(`/root/draft/${post_id}/edit`);
        }
      });
  }, [token, editingData, router]);

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
        <div className="relative border-l-2 border-ts p-2 pl-4 text-6xl font-bold">
          <textarea
            className="z-1 block h-16 w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-dim"
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
      <div className="bg-sbackg mt-20 rounded-lg" id="content">
        <textarea
          className={`block h-auto min-h-[30rem] w-full resize-y bg-transparent px-6 py-8 text-lg text-tp outline-none ${jetbrains.className}`}
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
