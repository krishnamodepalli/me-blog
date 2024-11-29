import { ReactNode } from "react";

import AuthContextProvider from "../_contexts/auth/Provider";
import RootNavBar from "@/components/ui/RootNavBar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthContextProvider>
        <RootNavBar />
        {children}
      </AuthContextProvider>
    </>
  );
};

export default RootLayout;
