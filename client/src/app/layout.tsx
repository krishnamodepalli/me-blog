import type { Metadata } from "next";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { raleway } from "./_fonts";
import "./globals.css";
import "./codeblock.css";

export const metadata: Metadata = {
  title: "Me Blog | Krishna Modepalli",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <style>
          {`
:root {

--rt-color-white: #fff;
--rt-color-dark: #222;
--rt-color-success: #8dc572;
--rt-color-error: #d62828;
--rt-color-warning: #f0ad4e;
--rt-color-info: #337ab7;
--rt-opacity: 0.9;
--rt-transition-show-delay: 0.15s;
--rt-transition-closing-delay: 0.15s;
}
`}
        </style>
        <main
          className={`${raleway.className} relative m-auto min-h-[800px] max-w-[1000px] pt-20`}
        >
          {children}
          <ToastContainer />
        </main>
      </body>
    </html>
  );
}
