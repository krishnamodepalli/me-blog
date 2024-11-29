// components
import Heading from "@/components/ui/Heading";
import PostList from "@/components/PostList";
import NavBar from "@/components/ui/NavBar";

export default async function Home() {
  return (
    <>
      <NavBar />
      <Heading>Me Blog</Heading>
      <PostList />
    </>
  );
}
