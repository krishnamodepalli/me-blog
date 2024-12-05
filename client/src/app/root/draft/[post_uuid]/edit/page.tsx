"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { jetbrains } from "@/app/_fonts";
import {
  getDraft as getDraftFromLocal,
  updateDraft,
} from "@/app/_utils/storage";
import { IDraftDetails } from "@/app/_types";
import { root_api } from "@/app/_utils/apis";

const Page = ({ params }: { params: { post_uuid: string } }) => {
  const { post_uuid } = params;

  const [editingData, setEditingData] = useState<IDraftDetails>({
    title: "",
    content: "",
  });
  const editingDataRef = useRef<IDraftDetails>(editingData);
  const lastFetchedRef = useRef<string>("");

  useEffect(() => {
    const draft = getDraftFromLocal(post_uuid);
    if (!draft) return;
    setEditingData(draft.draft);

    lastFetchedRef.current = draft.fetchedAt;
  }, [post_uuid]);

  /**\
   * This ref is used to save the editing data for every 3 seconds of inactivity
   */
  const timeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Save the data to database, if not possible due to internet issue, skip it.
   */
  const saveToDB = useCallback(() => {
    toast.promise(
      root_api.put(`/draft/${post_uuid}`, editingDataRef.current),
      {
        pending: "Saving to Database...",
        error: "Backend Issue, Saved to Local.",
        success: {
          render() {
            clearTimeout(timeoutRef.current);
            return "Saved to Database";
          },
        },
      },
      {
        theme: "light",
        autoClose: 2000,
      },
    );
  }, [post_uuid]);

  /**
   * Save the editing data into localStorage
   */
  const saveToLocal = useCallback(() => {
    const data = editingDataRef.current;
    updateDraft(post_uuid, data);
  }, [post_uuid]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveToLocal();
        saveToDB();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveToLocal, saveToDB]);

  // effect to save for every 3 seconds after any change
  useEffect(() => {
    editingDataRef.current = editingData;
    // Clear the existing timeout if there is a change
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set a new timeout for auto-saving
    timeoutRef.current = setTimeout(() => {
      saveToLocal();
      saveToDB();
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [editingData, saveToLocal, saveToDB]);

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
            className="z-1 block h-16 w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-t4"
            value={editingData.title}
            placeholder="Your title goes here..."
            onChange={(e) => {
              setEditingData((prev) => ({
                ...prev,
                title: e.target.value,
              }));
              clearTimeout(timeoutRef.current);
            }}
          ></textarea>
        </div>
      </div>
      <div className="mt-20 rounded-lg bg-bg2" id="content">
        <textarea
          value={editingData.content}
          placeholder="Start your story here..."
          onChange={(e) => {
            setEditingData((prev) => ({
              ...prev,
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
