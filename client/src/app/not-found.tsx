import type { Metadata } from "next";
import { montserrat } from "./_fonts";

export const metadata: Metadata = {
  title: "Not Found",
};

const ErrorPage = () => {
  return (
    <div className="mx-4 max-w-[1000px] pt-4 lg:m-auto lg:pt-40">
      <div className="mb-32">
        <h1
          className={`mb-6 text-center text-[3rem] font-black lg:text-[4rem] ${montserrat.className} text-skyblue`}
        >
          Sorry Mate
        </h1>
        <p className={`text-center text-2xl text-ts ${montserrat.className}`}>
          Ya hangin&apos; around tha &apos;rong place mate.
        </p>
      </div>
      <div
        className={`flex justify-center gap-8 text-ts ${montserrat.className} items-center`}
      >
        <span className="text-5xl font-thin">404</span>
        <p className="inline text-3xl font-extralight">Page Not Found</p>
      </div>
    </div>
  );
};

export default ErrorPage;
