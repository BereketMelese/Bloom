import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../service/api";
import LoadingSpinner from "../common/LoadingSpinner";

// Icons
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BsReply } from "react-icons/bs";

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // track commentId being replied to

  // --- Fetch comments ---
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/comments/post/${postId}`);
      return res.data.comments;
    },
  });

  // --- Create comment / reply ---
  const { mutate: createComment, isLoading: creating } = useMutation({
    mutationFn: async ({ content, parentComment }) => {
      const res = await api.post(`/comments/post/${postId}`, {
        content,
        parentComment,
      });
      return res.data.comment;
    },
    onSuccess: () => {
      setNewComment("");
      setReplyTo(null);
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries(["posts"]); // update post commentsCount
    },
    onError: () => toast.error("Failed to post comment"),
  });

  // --- Like comment ---
  const { mutate: likeComment } = useMutation({
    mutationFn: async (commentId) => api.post(`/comment/${commentId}/like`),
    onSuccess: () => queryClient.invalidateQueries(["comments", postId]),
    onError: () => toast.error("Failed to like comment"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    createComment({ content: newComment, parentComment: replyTo });
  };

  if (isLoading) return <LoadingSpinner size="sm" />;

  return (
    <div className="mt-3 border-t border-gray-700 pt-3">
      {/* Comment Input */}
      <form className="flex gap-2 mb-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={replyTo ? "Replying..." : "Add a comment..."}
          className="input input-bordered flex-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? <LoadingSpinner size="sm" /> : "Post"}
        </button>
      </form>

      {/* Comments List */}
      {comments?.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {comments.map((comment) => (
            <div key={comment._id} className="pl-0">
              <div className="flex items-center gap-2">
                <img
                  src={
                    comment.author.avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author.username}`
                  }
                  alt={comment.author.username}
                  className="w-6 h-6 rounded-full"
                />
                <p className="font-semibold text-sm">
                  {comment.author.username}
                </p>
                <span className="text-gray-400 text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="ml-8">{comment.content}</p>
              <div className="ml-8 flex gap-4 text-gray-400 text-sm">
                <button
                  onClick={() => likeComment(comment._id)}
                  className="flex items-center gap-1 hover:text-blue-500"
                >
                  {comment.hasLiked ? <AiFillLike /> : <AiOutlineLike />}
                  <span>{comment.likesCount || 0}</span>
                </button>
                <button
                  onClick={() => setReplyTo(comment._id)}
                  className="flex items-center gap-1 hover:text-green-500"
                >
                  <BsReply />
                  <span>Reply</span>
                </button>
              </div>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="ml-12 mt-2 flex flex-col gap-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex gap-2 items-start">
                      <img
                        src={
                          reply.author.avatar ||
                          `https://api.dicebear.com/7.x/identicon/svg?seed=${reply.author.username}`
                        }
                        alt={reply.author.username}
                        className="w-5 h-5 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {reply.author.username}
                        </p>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
