"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { Tooltip } from "react-tooltip";

import Each from "./utils/Each";
import { fireConfirmationDialog } from "./utils/ConfirmationDialog";

import formatDate from "@/app/_utils/formatDate";
import { IPostPreview } from "@/app/_types";
import { toast } from "react-toastify";
import { root_api } from "@/app/_utils/apis";

const DraftPreview = ({
  id,
  title,
  createdAt,
  deleteDraft,
}: {
  id: string;
  title: string;
  createdAt: string;
  deleteDraft: (id: string) => void;
}) => {
  const date = formatDate(new Date(createdAt));

  const handleDeleteDraft = useCallback(() => {
    fireConfirmationDialog({
      prompt: "Are you sure to delete this draft?",
      subPrompt: "This action cannot be undone!!",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => deleteDraft(id),
      theme: "danger",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative mb-4 flex w-full overflow-hidden rounded-lg bg-bg2 text-t4">
      <Link href={`/root/draft/${id}`} className="w-full px-8 py-4">
        <h2 className="my-2 text-3xl font-semibold tracking-wider text-t1">
          {title || "Untitled.."}
        </h2>
        <span className="italic text-t2">{date}</span>
      </Link>
      <div
        onClick={handleDeleteDraft}
        className="draft-trash-can group flex cursor-pointer items-center px-4 transition-all duration-150 hover:bg-bg4"
        data-tooltip-variant="error"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="fill-t2 group-hover:fill-[#d62828]"
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
  const [drafts, setDrafts] = useState<IPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteDraft = useCallback(async (draft_id: string) => {
    const draftToDelete = drafts.find((draft) => draft.id === draft_id);
    if (!draftToDelete) return;

    setDrafts((prev) => prev.filter((draft) => draft.id !== draft_id));
    toast.promise(root_api.delete(`/draft/${draft_id}`), {
      pending: "Deleting the draft",
      error: {
        render({ data }) {
          console.log(data);
          setDrafts((prev) => [...prev, draftToDelete]);
          return "Cannot delete the draft, please try again";
        },
      },
      success: {
        render() {
          return "Deleted the draft successfully";
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const { data } = await root_api("/draft/all");
        setDrafts((data.data as IPostPreview[]) || []);
      } catch (e) {
        toast.error(
          "Cannot fetch the drafts. Somethings not working at the server.",
        );
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

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
        of={drafts || []}
        render={(item, index) => (
          <DraftPreview
            key={index}
            id={item.id}
            title={item.title}
            createdAt={item.createdAt}
            deleteDraft={deleteDraft}
          />
        )}
      />
      <Tooltip anchorSelect=".draft-trash-can" content="Delete draft" />
    </div>
  );
};

export default DraftList;
