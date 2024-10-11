"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { jetbrains } from "@/app/_fonts";

const Page = ({ params }: { params: { post_uuid: string } }) => {
  const { post_uuid } = params;

  const [editingData, setEditingData] = useState({
    title: "",
    content: "",
  });
  const lastFetchedRef = useRef<string>("");

  useEffect(() => {
    const draftData = JSON.parse(
      localStorage.getItem(`draft:${post_uuid}`) as string,
    );
    const draft = draftData.draft;

    lastFetchedRef.current = draftData.lastFetched;
    setEditingData({
      title: draft.title,
      content: draft.content,
    });
  }, [post_uuid]);

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
    console.log("Auto-saved to localStorage");
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
    }, 5000); // 5 seconds

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
        <div className="relative border-l-2 border-ts p-2 pl-4 text-6xl font-bold">
          <textarea
            className="z-1 block h-16 w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-dim"
            value={editingData.title}
            placeholder="Your title here..."
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
      <div className="mt-20 rounded-lg bg-dim" id="content">
        <textarea
          value={editingData.content}
          onChange={(e) => {
            setEditingData((prev) => ({
              title: prev.title,
              content: e.target.value,
            }));
          }}
          className={`block h-auto min-h-[30rem] w-full resize-y bg-transparent px-6 py-8 text-lg text-tp outline-none ${jetbrains.className}`}
        ></textarea>
      </div>
    </div>
  );
};

export default Page;
