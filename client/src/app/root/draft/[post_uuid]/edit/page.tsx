"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import { jetbrains } from "@/app/_fonts";
import getDraft from "@/app/_utils/getDraft";
import { IDraft } from "@/app/_types";

const Page = ({ params }: { params: { post_uuid: string } }) => {
  const { post_uuid } = params;
  const token = Cookies.get("token") as string;

  const [editingData, setEditingData] = useState({
    title: "",
    content: "",
  });
  const lastFetchedRef = useRef<string>("");

  useEffect(() => {
    const draftData = JSON.parse(
      localStorage.getItem(`draft:${post_uuid}`) as string,
    );
    let draft: IDraft;
    if (draftData === null) {
      getDraft(token, post_uuid).then((res) => {
        setEditingData({ ...res });
      });
    } else {
      draft = draftData.draft;
      setEditingData({
        title: draft.title,
        content: draft.content,
      });
    }

    lastFetchedRef.current = draftData.lastFetched;
  }, [token, post_uuid]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveToLocal = useCallback(() => {
    localStorage.setItem(
      `draft:${post_uuid}`,
      JSON.stringify({
        draft: editingData,
        lastUpdated: Date.now().toString(),
        lastFetched: lastFetchedRef.current,
      }),
    );
    toast.success("Saved to local.", {
      theme: "colored",
      autoClose: 1500,
    });
  }, [editingData, post_uuid]);

  // effect to save for every 5 seconds after any change
  useEffect(() => {
    // Clear the existing timeout if there is a change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout for auto-saving
    timeoutRef.current = setTimeout(() => {
      saveToLocal();
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveToLocal]);

  // effect to save when moved away from this page
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("running before unload");
      saveToLocal();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveToLocal]);

  return (
    <div className="relative pb-20">
      <div id="title" className="mb-8">
        <div className="relative border-l-2 border-t2 p-2 pl-4 text-6xl font-bold">
          <textarea
            className="z-1 block h-16 w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-dim"
            value={editingData.title}
            placeholder="Your title goes here..."
            onChange={(e) => {
              setEditingData((prev) => ({
                title: e.target.value,
                content: prev.content,
              }));
              clearTimeout(timeoutRef.current);
            }}
          ></textarea>
        </div>
      </div>
      <div className="mt-20 rounded-lg bg-bg2" id="content">
        <textarea
          value={editingData.content}
          onChange={(e) => {
            setEditingData((prev) => ({
              title: prev.title,
              content: e.target.value,
            }));
          }}
          className={`block h-auto min-h-[30rem] w-full resize-y bg-transparent px-6 py-8 text-lg text-t1 outline-none ${jetbrains.className}`}
        ></textarea>
      </div>
    </div>
  );
};

export default Page;
