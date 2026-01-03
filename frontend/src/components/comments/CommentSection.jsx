import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "../../service/api";
import LoadingSpinner from "../common/LoadingSpinner";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [replyMeta, setReplyMeta] = useState(null); // { parentId, username }

  const { data, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/comments/post/${postId}`);
      const { comments, replies } = res.data;

      // Attach replies to top-level comments
      const commentsWithReplies = comments.map((comment) => ({
        ...comment,
        replies: replies.filter(
          (r) => r.parentComment?.toString() === comment._id.toString()
        ),
      }));

      return commentsWithReplies;
    },
  });

  const comments = data || [];

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: async () =>
      api.post(`/comments/post/${postId}`, {
        content,
        parentComment: replyMeta?.parentId || null,
      }),
    onSuccess: () => {
      setContent("");
      setReplyMeta(null);
      queryClient.invalidateQueries(["comments", postId]);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Comment cannot be empty");
    createComment();
  };

  if (isLoading) return <LoadingSpinner size="sm" />;

  return (
    <div className="mt-3 border-t border-gray-700 pt-3">
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder={
            replyMeta
              ? `Replying to @${replyMeta.username}`
              : "Add a comment..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary" disabled={isPending}>
          {isPending ? <LoadingSpinner size="sm" /> : "Post"}
        </button>
      </form>

      {/* Comments */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              setReplyMeta={setReplyMeta}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
