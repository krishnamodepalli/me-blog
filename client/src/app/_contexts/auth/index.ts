"use client";
import React, { createContext } from "react";

interface IState {
  isLoggedIn: boolean;
}

interface IAuthContext {
  state: IState;
  dispatch: React.Dispatch<React.SetStateAction<IState>>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export default AuthContext;
export type { IState, IAuthContext };
