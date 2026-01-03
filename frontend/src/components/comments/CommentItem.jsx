import { useState } from "react";
import ReplyItem from "./ReplyItem";
import { BsReply } from "react-icons/bs";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

const CommentItem = ({ comment, setReplyMeta }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div>
      {/* Comment */}
      <div className="flex gap-2">
        <img
          src={
            comment.author.avatar ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author.username}`
          }
          className="w-7 h-7 rounded-full"
        />

        <div className="flex-1">
          <p className="text-sm font-semibold">{comment.author.username}</p>
          <p className="text-sm">{comment.content}</p>

          {/* Reply button */}
          <button
            onClick={() =>
              setReplyMeta({
                parentId: comment._id,
                username: comment.author.username,
              })
            }
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-blue-500 mt-1"
          >
            <BsReply /> Reply
          </button>

          {/* Show replies toggle */}
          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies((prev) => !prev)}
              className="flex items-center gap-1 text-xs mt-1 text-gray-400 hover:text-blue-500"
            >
              {showReplies ? <FaAngleUp /> : <FaAngleDown />}
              {` ${comment.replies.length} replies`}
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-8 mt-2 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <ReplyItem key={reply._id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
