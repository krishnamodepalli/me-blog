"use client";

import { ReactNode, useEffect } from "react";

import { getDraft as getDraftFromLocal, addDraft } from "@/app/_utils/storage";
import getDraft from "@/app/_utils/getDraft";
import { root_api } from "@/app/_utils/apis";

const Layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { post_uuid: string };
}) => {
  const { post_uuid } = params;

  /**
   * what's changing now:
   *  1. first light task: check if there is a draft content stored inside the
   *     localStorage. Using lastUpdated key, we will determine if the draft
   *     is still useful or not.
   */

  useEffect(() => {
    const startup = async () => {
      const localDraft = getDraftFromLocal(post_uuid);

      if (!localDraft) {
        const data = await getDraft(post_uuid);
        addDraft(data);
      } else {
        const { data } = await root_api.get(`/draft/${post_uuid}/updatedAt`);
        const localDate = new Date(localDraft.updatedAt);
        const remoteDate = new Date(data.updatedAt);

        if (localDate < remoteDate) {
          const draft = await getDraft(post_uuid);
          addDraft(draft);
        }
      }
    };

    startup();
  }, [post_uuid]);

  // effect to fetch for the first time when opened the draft
  // useEffect(() => {
  //   getDraft(token, post_uuid)
  //     .then((res) => {
  //       const draft = res;
  //       localStorage.setItem(
  //         `draft:${post_uuid}`,
  //         JSON.stringify({
  //           draft: draft,
  //           lastUpdated: Date.now().toString(),
  //           lastFetched: Date.now().toString(),
  //         }),
  //       );
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [post_uuid, token]);

  // // effect to post the changes to database after changes are made
  // useEffect(() => {
  //   if (pathname !== `/root/draft/${post_uuid}`) return;

  //   const draftData =
  //     JSON.parse(localStorage.getItem(`draft:${post_uuid}`) as string) || {};
  //   if (Object.keys(draftData).length === 0) return;

  //   const { lastUpdated, lastFetched } = draftData;
  //   const lastUpdatedTime = new Date(parseInt(lastUpdated));
  //   const lastFetchedTime = new Date(parseInt(lastFetched));

  //   const { draft } = draftData;
  //   const { title, content } = draft;

  //   if (lastUpdatedTime > lastFetchedTime) {
  //     axios.put(
  //       `${process.env.NEXT_PUBLIC_API_URL}/draft/${post_uuid}`,
  //       {
  //         title,
  //         content,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //   }
  // }, [pathname, post_uuid, token]);

  return <div>{children}</div>;
};

export default Layout;
