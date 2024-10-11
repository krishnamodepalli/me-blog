"use client";

import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";

import AuthContext, { IState } from "./index";

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<IState>({ isLoggedIn: false });
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuthState({ isLoggedIn: true });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state: authState, dispatch: setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
