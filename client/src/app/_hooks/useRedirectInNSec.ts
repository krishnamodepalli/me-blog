import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { rref, rstate } from "@/app/_types";

export let redirect: null | ((seconds: number, to: string) => void) = null;

const setRedirect = (_redirect: ((seconds: number, to: string) => void) | null) => {
  redirect = _redirect;
}

const useRedirectInNSec = () => {
  const router = useRouter();

  const [active, setActive]: rstate<boolean> = useState<boolean>(false);
  const [time, setTime]: rstate<number> = useState<number>(0);
  const [to, setTo]: rstate<string> = useState<string>("");

  const intervalRef: rref<NodeJS.Timeout | undefined> = useRef<NodeJS.Timeout>();

  const triggerRedirect = useCallback((seconds: number, to: string) => {
    clearInterval(intervalRef.current);
    if (seconds < 0) {
      throw Error("Time cannot be negative!!");
    }
    setTime(seconds);
    setActive(true);
    setTo(to);
  }, []);

  useEffect(() => {
    if (redirect) return;
    setRedirect(triggerRedirect);

    return () => {
      setRedirect(null);
    }
  }, [triggerRedirect]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (time === 1) {
        router.push(to);
        setActive(false);
        setTo("");
        setTime(0);
      }
      setTime((prev) => Math.floor(prev - 1));
    }, 1000);
  }, [to, time, router]);

  return { active, time };
};

export default useRedirectInNSec;
