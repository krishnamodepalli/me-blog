import React, { FC } from "react";
import { raleway } from "@/app/_fonts";

interface INavBtn {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const NavBtn: FC<INavBtn> = ({ className, onClick, children }) => {
  return (
    <li
      className={`${raleway.className} text-lg font-semibold tracking-wider hover:text-primary hover:underline ${className}`}
    >
      <button onClick={onClick}>{children}</button>
    </li>
  );
};

export default NavBtn;
