"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import OTPInput from "react-otp-input";

import useLogin from "@/app/_hooks/useLogin";
import { raleway } from "@/app/_fonts";

const LoginPage = () => {
  const { loading, error, login } = useLogin();
  const router = useRouter();
  const [otp, setOTP] = useState<string>("");

  const handleLogin = useCallback(async () => {
    login(otp).then(() => {
      router.push("/root");
    });
  }, [otp, router, login]);

  return (
    <div
      className={`flex w-full items-center justify-center ${raleway.className}`}
    >
      <div className="mt-[min(30%,_600px)] flex w-[400px] flex-col rounded-lg bg-bg2 py-4 shadow-lg">
        <h2 className="px-[5%] text-xl tracking-wide text-t1">
          Please input your TOPT code:
        </h2>
        <OTPInput
          value={otp}
          onChange={setOTP}
          numInputs={8}
          skipDefaultStyles
          shouldAutoFocus
          renderInput={(props) => <input {...props} />}
          inputStyle="w-5 bg-transparent text-center border-b border-neutral-500 focus:border-neutral-200 pb-[2px] [&:nth-child(4)]:mr-4 outline-none text-2xl font-bold"
          containerStyle={"flex justify-center gap-4 mt-8"}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mx-auto my-4 mt-8 w-[90%] rounded-md border-none bg-primary py-2 font-bold tracking-wider text-black outline-none outline-offset-2 hover:brightness-110 focus:outline-1 focus:outline-primary disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-800 disabled:hover:brightness-100"
        >
          {loading ? "Logging In" : "Login"}
        </button>
        <p className="text-center tracking-wide text-rose-500">{error}</p>
      </div>
    </div>
  );
};

export default LoginPage;
