"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import getDraft from "@/app/_utils/getDraft";

const Layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { post_uuid: string };
}) => {
  const pathname = usePathname();

  const { post_uuid } = params;
  const token = Cookies.get("token") as string;

  // effect to fetch for the first time when opened the draft
  useEffect(() => {
    getDraft(token, post_uuid)
      .then((res) => {
        const draft = res;
        localStorage.setItem(
          `draft:${post_uuid}`,
          JSON.stringify({
            draft: draft,
            lastUpdated: Date.now().toString(),
            lastFetched: Date.now().toString(),
          }),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, [post_uuid, token]);

  // effect to post the changes to database after changes are made
  useEffect(() => {
    if (pathname !== `/root/draft/${post_uuid}`) return;

    const draftData = JSON.parse(
      localStorage.getItem(`draft:${post_uuid}`) as string,
    );
    const { lastUpdated, lastFetched } = draftData;
    const lastUpdatedTime = new Date(parseInt(lastUpdated));
    const lastFetchedTime = new Date(parseInt(lastFetched));

    const { draft } = draftData;
    const { title, content } = draft;

    if (lastUpdatedTime > lastFetchedTime) {
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/draft/${post_uuid}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  }, [pathname, post_uuid, token]);

  return <div>{children}</div>;
};

export default Layout;
