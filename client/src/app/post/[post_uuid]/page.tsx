
import getAllPosts, { getPost } from "@/app/_utils/getPosts";
import myMDParser from "../../_utils/markParser";

const PostPage = async ({ params }: { params: { post_uuid: string } }) => {
  const { post_uuid } = params;
  const post = await getPost(post_uuid);

  return (
    <div className="mb-60">
      <div id="title" className="mb-20">
        <div className="relative p-2 pl-4 text-6xl font-bold">
          <p className="z-1 text-tp outline-none">{post.title}</p>
        </div>
      </div>
      <div
        className="my-8"
        id="blog-content"
        dangerouslySetInnerHTML={{ __html: myMDParser.parse(post.content || "") }}
      ></div>
    </div>
  );
};

export default PostPage;

export const generateStaticParams = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    post_uuid: post.id,
  }));
};
