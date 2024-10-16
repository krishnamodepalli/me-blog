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
      className={`flex h-screen w-full items-center justify-center ${raleway.className}`}
    >
      <div className="flex w-[400px] flex-col py-4 rounded-lg bg-dim shadow-lg">
        <h2 className="px-[5%] text-tp tracking-wide text-xl">Please input your TOPT code:</h2>
        <OTPInput
          value={otp}
          onChange={setOTP}
          numInputs={8}
          skipDefaultStyles
          renderInput={(props) => <input {...props} />}
          inputStyle={`px-[6px] bg-backg focus:border-tp border-2 border-dim text-xl text-tp rounded-md w-7 h-9`}
          containerStyle={"flex justify-center gap-4 mt-8"}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mx-auto mb-4 mt-10 w-[90%] rounded-lg border-2 border-transparent bg-blue-500 py-[5px] text-2xl text-tp shadow-md outline-none transition-all duration-300 hover:bg-backg focus:bg-backg focus:text-tp disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-ts disabled:shadow-none"
        >
          Login
        </button>
        <p className="text-center tracking-wide text-red-500">{error}</p>
      </div>
    </div>
  );
};

export default LoginPage;
