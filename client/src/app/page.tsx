// components
import Heading from "@/components/ui/Heading";
import PostList from "@/components/PostList";

// others

export default async function Home() {
  return (
    <>
      <Heading>Me Blog</Heading>
      <PostList />
    </>
  );
}
