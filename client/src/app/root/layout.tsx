import { ReactNode } from "react";

import AuthContextProvider from "../_contexts/auth/Provider";
import RootNavBar from "@/components/ui/RootNavBar";
import { CDCanvas } from "@/components/utils/ConfirmationDialog";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthContextProvider>
        <RootNavBar />
        {children}
      </AuthContextProvider>
      <CDCanvas />
    </>
  );
};

export default RootLayout;
