import { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* HEADER TABS */}
      <div className="flex w-full sticky top-0 z-10 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <button
          className="flex-1 flex flex-col items-center justify-center h-14 transition-all duration-300 hover:bg-base-200/50 relative"
          onClick={() => setFeedType("forYou")}
        >
          <span
            className={`text-sm font-bold tracking-wide transition-colors ${
              feedType === "forYou" ? "text-primary" : "text-base-content/50"
            }`}
          >
            For You
          </span>
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-20 h-1 bg-red-400 rounded-t-full shadow-[0_-2px_10px_rgba(var(--p),0.5)]" />
          )}
        </button>

        <button
          className="flex-1 flex flex-col items-center justify-center h-14 transition-all duration-300 hover:bg-base-200/50 relative"
          onClick={() => setFeedType("following")}
        >
          <span
            className={`text-sm font-bold tracking-wide transition-colors ${
              feedType === "following" ? "text-primary" : "text-base-content/50"
            }`}
          >
            Following
          </span>
          {feedType === "following" && (
            <div className="absolute bottom-0 w-20 h-1 bg-red-400 rounded-t-full shadow-[0_-2px_10px_rgba(var(--p),0.5)]" />
          )}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4">
        <CreatePost />
        <Posts feedType={feedType} />
      </div>
    </div>
  );
};

export default HomePage;
