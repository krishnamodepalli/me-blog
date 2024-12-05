import { useEffect, useState } from "react";

const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const handleInternetState = () => {
    console.log("switching isOnline....");
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", handleInternetState);
    window.addEventListener("offline", handleInternetState);

    return () => {
      window.removeEventListener("online", handleInternetState);
      window.removeEventListener("offline", handleInternetState);
    };
  }, []);

  return { isOnline };
};

export default useIsOnline;
