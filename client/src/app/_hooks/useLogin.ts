import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import useAuth from "./useAuth";

const useLogin = () => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const login = (code: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          code,
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            const token = res.data.token as string;
            Cookies.set("token", token, {
              expires: 1,
              secure: true,
              path: "/",
            });
            dispatch({ isLoggedIn: true });
            setError("");
            resolve(200);
          }
        })
        .catch((err) => {
          if (err.status === 401) setError("Invalid Code");
          else if (err.status === 500)
            setError("System Error, please try again later");
          reject(err.statusText);
        })
        .finally(() => setLoading(false));
    });
  };

  return { loading, error, login };
};

export default useLogin;
