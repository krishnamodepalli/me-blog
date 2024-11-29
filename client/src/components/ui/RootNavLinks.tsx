"use client";
import React, { useCallback } from "react";
import Cookies from "js-cookie";

import useAuth from "@/app/_hooks/useAuth";
import NavBtn from "./NavBtn";
import { redirect } from "next/navigation";

const RootNavLinks = (): React.ReactNode => {
  const { state, dispatch } = useAuth();

  const logout = useCallback(() => {
    dispatch({ isLoggedIn: false });
    Cookies.remove("token");
    redirect("/root/login");
  }, [dispatch]);

  if (!state.isLoggedIn) return <></>;

  return (
    <ul className="flex list-none">
      <NavBtn onClick={logout} className="group text-t4 hover:text-t2">
        Logout
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width={18}
          className="ml-3 inline fill-t4 group-hover:fill-t2"
        >
          <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
        </svg>
      </NavBtn>
    </ul>
  );
};

export default RootNavLinks;