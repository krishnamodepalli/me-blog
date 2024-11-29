import Link from "next/link";

const NavBar = () => {
  return (
    <header className="absolute top-0 mb-16 w-full py-2 pt-4 backdrop-blur">
      <nav className="flex justify-between text-lg lg:text-2xl">
        <>
          <Link href="/" className="tracking-wide text-primary hover:underline">
            Me-Blog
          </Link>
        </>
      </nav>
    </header>
  );
};

export default NavBar;
