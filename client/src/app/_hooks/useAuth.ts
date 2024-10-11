
import AuthContext from "@/app/_contexts/auth";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth Context should be used only inside Auth Context Provider");
  }
  return context;
}

export default useAuth;