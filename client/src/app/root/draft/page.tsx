"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import DraftList from "@/components/DraftList";
import Each from "@/components/utils/Each";

import { differenceInHours } from "date-fns";
import { root_api } from "@/app/_utils/apis";
import { montserrat } from "@/app/_fonts";
import { IPostPreview, rstate } from "@/app/_types";
import {
  getDraftPreviews,
  removeDraft,
  setDraftPreviews,
} from "@/app/_utils/storage";

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

const Page = () => {
  const [drafts, setDrafts]: rstate<IPostPreview[]> = useState<IPostPreview[]>(
    [],
  );
  const [loading, setLoading]: rstate<boolean> = useState(true);

  /**
   * Checking for the drafts (IPostPreviews) in the localStorage.
   * If present and is not older than 2 hours, Okay
   * Otherwise, fetch from the database.
   */
  useEffect(() => {
    // getting the data from localStorage
    setLoading(true);
    const draftPreviews = getDraftPreviews();

    const getDrafts = async (): Promise<IPostPreview[]> => {
      try {
        const { data } = await root_api.get("/draft/all");
        return data.drafts as IPostPreview[];
      } catch (err) {
        console.error(err);
        toast.error(
          "Cannot fetch the drafts. Somethings not working at the server.",
        );
        return [];
      }
    };

    if (!draftPreviews) {
      // we have to get the data from api
      (async () => {
        const res = await getDrafts();
        setDrafts(res);
        setDraftPreviews(res as IPostPreview[], new Date());
      })();
    } else {
      // even if the application have the data, and is fetched at least 2 hours
      // ago, then refetch it.
      if (differenceInHours(new Date(), new Date(draftPreviews.fetchedAt)) < 2)
        setDrafts(draftPreviews.drafts || []);
      else {
        (async () => {
          const res = await getDrafts();
          setDrafts(res);
          setDraftPreviews(res as IPostPreview[], new Date());
        })();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Deletes a particular draft from database, redis, and also frontend localStorage
   * @param draft_id The id of the draft to delete
   */
  const deleteDraftById = useCallback(
    (draft_id: string) => {
      console.log("deleting....");
      const draftToDelete = drafts.find((draft) => draft.id === draft_id);
      if (!draftToDelete) return;
      const indexOfDraftToDelete = drafts.indexOf(draftToDelete);

      setDrafts((prev) => prev.filter((draft) => draft.id !== draft_id));
      toast.promise(root_api.delete(`/draft/${draft_id}`), {
        pending: "Deleting the draft",
        error: {
          render({ data }) {
            console.log(data);
            setDrafts((prev) =>
              prev.splice(indexOfDraftToDelete, 0, draftToDelete),
            );
            return "Cannot delete the draft, please try again";
          },
        },
        success: {
          render() {
            removeDraft(draft_id);
            return "Deleted the draft successfully";
          },
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // render loading state with skeleton body
  if (loading) {
    return (
      <>
        <h1
          className={`my-12 text-[3rem] text-primary ${montserrat.className} text-center`}
        >
          Your Drafts
        </h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <Each
            of={[0, 1, 2]}
            render={(_, index) => <LoadingDraft key={index} />}
          />
        </div>
      </>
    );
  }

  return (
    <div className="mb-60">
      <h1
        className={`my-12 text-[3rem] text-primary ${montserrat.className} text-center`}
      >
        Your Drafts
      </h1>
      <DraftList drafts={drafts} deleteDraft={deleteDraftById} />
    </div>
  );
};

export default Page;
