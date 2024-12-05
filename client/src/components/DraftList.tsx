"use client";

import Link from "next/link";
import { Tooltip } from "react-tooltip";

import Each from "./utils/Each";
import { fireConfirmationDialog } from "./utils/ConfirmationDialog";

import formatDate from "@/app/_utils/formatDate";
import { IPostPreview } from "@/app/_types";
import myMDParser from "@/app/_utils/markParser";

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

  return (
    <div className="relative mb-4 flex w-full overflow-hidden rounded-lg bg-bg3 text-t4">
      <Link href={`/root/draft/${id}`} className="w-full px-8 py-4">
        <h2
          className="my-2 text-3xl font-semibold tracking-wider text-t1"
          dangerouslySetInnerHTML={{
            __html: (myMDParser.parseInline(title) as string) || "Untitled..",
          }}
        ></h2>
        <span className="italic text-t2">{date}</span>
      </Link>
      <div
        onClick={() =>
          fireConfirmationDialog({
            prompt: "Are you sure to delete this draft?",
            subPrompt: "This action cannot be undone!!",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onConfirm: () => deleteDraft(id),
            theme: "danger",
          })
        }
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

const DraftList = ({
  drafts,
  deleteDraft,
}: {
  drafts: IPostPreview[];
  deleteDraft: (id: string) => void;
}) => {
  return (
    <div>
      <Each
        of={drafts || []}
        render={(item, index) => (
          <DraftPreview {...item} key={index} deleteDraft={deleteDraft} />
        )}
      />
      <Tooltip anchorSelect=".draft-trash-can" content="Delete draft" />
    </div>
  );
};

export default DraftList;
