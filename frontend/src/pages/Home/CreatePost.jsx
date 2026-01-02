import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import api from "../../service/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { POST_CATEGORIES, POST_STATUS } from "../../constants/postOptions";

// Icons - make sure to install react-icons or use your own icons
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("goal");
  const [status, setStatus] = useState("pending");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);

  const imgRef = useRef();

  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (postData) => {
      // Prepare the data for backend
      const postToSend = {
        content: postData.content,
        category: postData.category,
        status: postData.status,
        tags: postData.tags
          ? postData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : [],
      };

      // Add image if exists
      if (postData.image) {
        postToSend.images = [postData.image];
      }

      const res = await api.post("/post", postToSend);
      return res.data.post;
    },
    onSuccess: () => {
      // Reset form to default values
      setContent("");
      setCategory("goal");
      setStatus("pending");
      setTags("");
      setImage(null);

      // Clear file input
      if (imgRef.current) {
        imgRef.current.value = null;
      }

      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    createPost({
      content: content.trim(),
      category,
      status,
      tags,
      image,
    });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (optional)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // base64 string
      };
      reader.onerror = () => {
        toast.error("Failed to process image");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imgRef.current) {
      imgRef.current.value = null;
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={
              authUser?.avatar ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${authUser?.username || "user"}`
            }
            alt={authUser?.username}
          />
        </div>
      </div>

      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea textarea-bordered w-full p-3 text-lg resize-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
        />

        {/* Category, Status, Tags inputs - optional but recommended */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="select select-bordered"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {POST_STATUS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="input input-bordered"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {/* Image preview */}
        {image && (
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 z-10 btn btn-xs btn-circle btn-error"
            >
              <IoCloseSharp className="w-4 h-4" />
            </button>
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-72 object-contain rounded-lg border"
            />
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              className="btn btn-ghost btn-circle"
            >
              <CiImageOn className="w-6 h-6 text-primary" />
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-circle"
              onClick={() => toast.error("Emoji picker coming soon!")}
            >
              <BsEmojiSmileFill className="w-5 h-5 text-primary" />
            </button>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={imgRef}
              onChange={handleImgChange}
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="btn btn-primary rounded-full px-6"
          >
            {isPending ? <LoadingSpinner size="sm" /> : "Post"}
          </button>
        </div>

        {isError && (
          <div className="alert alert-error mt-2">
            <span>
              {error.response?.data?.message || "Something went wrong"}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
