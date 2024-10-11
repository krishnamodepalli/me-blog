import { ReactNode } from "react";

import AuthContextProvider from "../_contexts/auth/Provider";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthContextProvider>{children}</AuthContextProvider>
    </>
  );
};

export default RootLayout;
