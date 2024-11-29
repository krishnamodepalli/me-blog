import Link from "next/link";
import RootNavLinks from "./RootNavLinks";

const RootNavBar: React.FC = () => {
  return (
    <header className="absolute top-0 mb-16 w-full pt-8 backdrop-blur">
      <nav className="flex justify-between text-lg lg:text-2xl">
        <>
          <Link href="/" className="tracking-wide text-primary hover:underline">
            Me-Blog
          </Link>
        </>
        <ul className="flex list-none">
          <RootNavLinks />
        </ul>
      </nav>
    </header>
  );
};

export default RootNavBar;
