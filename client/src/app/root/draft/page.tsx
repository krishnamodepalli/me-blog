import DraftList from "@/components/DraftList";

import { montserrat } from "@/app/_fonts";

const Page = async () => {
  return (
    <>
      <h1
        className={`my-12 text-[3rem] text-primary ${montserrat.className} text-center`}
      >
        Your Drafts
      </h1>
      <DraftList />
    </>
  );
};

export default Page;
