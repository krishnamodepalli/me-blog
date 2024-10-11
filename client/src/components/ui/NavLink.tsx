import Link from "next/link";
import React, { FC } from "react";

import { raleway } from "@/app/_fonts";

interface INavLink {
  href: string;
  children: React.ReactNode;
}

const NavLink: FC<INavLink> = ({ href, children }) => {
  return (
    <li className="ml-6">
      <Link
        href={href}
        className={`${raleway.className} text-lg font-semibold tracking-wider hover:text-skyblue hover:underline`}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavLink;
