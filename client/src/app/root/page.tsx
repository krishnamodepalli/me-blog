// list out the posts

import Link from "next/link";

import Heading from "@/components/ui/Heading";

const RootPage = () => {
  return (
    <div className="relative mx-auto h-[700px] w-[1000px]">
      <Heading>Your Posts</Heading>
      <div className="absolute bottom-8 flex w-full flex-col gap-12 lg:flex-row-reverse">
        <Link
          href="/root/new"
          className="flex items-center justify-center gap-4 border-2 border-transparent bg-primary py-3 text-2xl font-semibold text-bg1 shadow-lg outline-offset-2 transition-all duration-300 lg:w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width={24}
            fill="inherit"
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>
          Draft New Post
        </Link>
        <Link
          href="/root/draft"
          className="flex items-center justify-center border-2 border-t1 bg-transparent py-3 text-2xl font-semibold text-t2 shadow-lg outline-offset-2 transition-all duration-300 hover:border-transparent hover:bg-primary hover:text-bg1 focus:bg-primary focus:text-bg1 lg:w-full"
        >
          Go to Drafts
        </Link>
      </div>
    </div>
  );
};

export default RootPage;
