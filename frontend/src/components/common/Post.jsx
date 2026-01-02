import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "../../service/api";
import LoadingSpinner from "../common/LoadingSpinner";

// Icons
import { FaRegHeart, FaHeart, FaRegComment, FaTrash } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

import CommentSection from "./CommentSection";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const [showComments, setShowComments] = useState(false);

  // Check if current user is the post author
  const isMyPost = authUser?._id === post.author._id;

  // --- Like / Unlike Post ---
  const { mutate: toggleLike, isPending: liking } = useMutation({
    mutationFn: () => api.post(`/post/${post._id}/like`),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
    onError: () => toast.error("Failed to like post"),
  });

  // --- Bookmark / Remove Bookmark ---
  const { mutate: toggleBookmark, isPending: bookmarking } = useMutation({
    mutationFn: () => api.post(`/post/${post._id}/bookmark`),
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
    onError: () => toast.error("Failed to bookmark post"),
  });

  // --- Delete Post (if author) ---
  const { mutate: deletePost, isLoading: deleting } = useMutation({
    mutationFn: () => api.delete(`/post/${post._id}`),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => toast.error("Failed to delete post"),
  });

  return (
    <div className="border-b border-gray-700 p-4 hover:bg-base-100/30 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={
            post.author.avatar ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${post.author.username}`
          }
          alt={post.author.username}
          className="w-10 h-10 rounded-full border border-base-300"
        />
        <div className="flex-1">
          <p className="font-semibold">{post.author.username}</p>
          <p className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Delete button - Only show if user is the author */}
        {isMyPost && (
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                deletePost();
              }
            }}
            disabled={deleting}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete post"
          >
            {deleting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <FaTrash className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <p className="mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Post Images - Small size as before */}
      {post.images?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Post image ${idx}`}
              className="w-32 h-32 object-cover rounded-md border border-base-300"
            />
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-6 text-gray-400 mb-2">
        {/* Like Button */}
        <button
          onClick={() => toggleLike()}
          disabled={liking}
          className="flex items-center gap-2 hover:text-red-500 transition-colors group"
          title={post.hasLiked ? "Unlike" : "Like"}
        >
          {/* Show loading spinner while liking */}
          {liking ? (
            <LoadingSpinner size="sm" />
          ) : post.hasLiked ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 group-hover:text-red-500" />
          )}
          <span
            className={`text-sm ${post.hasLiked ? "text-red-500" : "group-hover:text-red-500"}`}
          >
            {post.likesCount || 0}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors group"
          title="Comments"
        >
          <FaRegComment className="w-5 h-5 group-hover:text-blue-500" />
          <span className="text-sm group-hover:text-blue-500">
            {post.commentsCount || 0}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark()}
          disabled={bookmarking}
          className="ml-auto hover:text-yellow-500 transition-colors"
          title={post.hasBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {/* Show loading spinner while bookmarking */}
          {bookmarking ? (
            <LoadingSpinner size="sm" />
          ) : post.hasBookmarked ? (
            <BsBookmarkFill className="w-5 h-5 text-yellow-500" />
          ) : (
            <BsBookmark className="w-5 h-5 hover:text-yellow-500" />
          )}
        </button>
      </div>

      {/* Comment Section */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
};

export default Post;
