import { useQuery } from "@tanstack/react-query";
import api from "../../service/api";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType = "forYou" }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/post";
      case "following":
        return "/post/feed";
      default:
        return "/post";
    }
  };

  const POST_ENDPOINT = getPostEndPoint();

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      const res = await api.get(POST_ENDPOINT); // ✅ must use .get
      return res.data.posts;
    },
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        {error?.message || "Failed to load posts"}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-center my-4">No posts in this tab 👻</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-base-300">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
