import { BsReply } from "react-icons/bs";

const ReplyItem = ({ reply }) => {
  return (
    <div className="flex gap-2">
      <img
        src={
          reply.author.avatar ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${reply.author.username}`
        }
        className="w-6 h-6 rounded-full"
      />

      <div>
        <p className="text-sm font-semibold">{reply.author.username}</p>
        <p className="text-sm">{reply.content}</p>
      </div>
    </div>
  );
};

export default ReplyItem;
