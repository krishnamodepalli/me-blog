import { montserrat } from "@/app/_fonts";
import { ReactNode } from "react";

interface IHeading {
  children: ReactNode;
  className?: string;
}

const Heading = ({ children, className }: IHeading) => {
  return (
    <h1
      className={`${className} ${montserrat.className} mb-20 text-center tracking-widest lg:text-[3rem] dark:text-skyblue`}
    >
      {children}
    </h1>
  );
};

export default Heading;
