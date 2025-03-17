import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import moment from "moment";

const Comments = ({ jobId }) => {
  const { isAuthenticated, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const commentsEndRef = useRef(null);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [jobId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/jobs/${jobId}/comments`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setComments(response.data.comments.reverse());
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Nepodarilo sa načítať komentáre.");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
        withCredentials: true,
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Musíte sa prihlásiť, aby ste mohli pridať komentár.");
      return;
    }
    if (newComment.trim() === "") {
      toast.error("Komentár nemôže byť prázdny.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/jobs/${jobId}/comments`,
        { content: newComment },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        const newCommentData = {
          ...response.data.comment,
          user: currentUser,
          replies: [],
        };
        setComments((prevComments) => [newCommentData, ...prevComments]);
        setNewComment("");
        toast.success("Komentár bol úspešne pridaný.");
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Nepodarilo sa pridať komentár.");
    }
  };

  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    const replyContent = replies[commentId];
    if (!isAuthenticated) {
      toast.error("Musíte sa prihlásiť, aby ste mohli pridať odpoveď.");
      return;
    }
    if (!replyContent || replyContent.trim() === "") {
      toast.error("Odpoveď nemôže byť prázdna.");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/jobs/${jobId}/comments/${commentId}/replies`,
        { content: replyContent },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...(comment.replies || []),
                    { ...response.data.reply, user: currentUser },
                  ],
                }
              : comment
          )
        );
        setReplies((prevReplies) => ({ ...prevReplies, [commentId]: "" }));
        setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
        toast.success("Odpoveď bola úspešne pridaná.");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Nepodarilo sa pridať odpoveď.");
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditCommentId(commentId);
    setEditCommentContent(content);
  };

  const saveEditedComment = async (commentId) => {
    if (!editCommentContent.trim()) {
      toast.error("Komentár nemôže byť prázdny.");
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/jobs/${jobId}/comments/${commentId}`,
        { content: editCommentContent },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: editCommentContent }
              : comment
          )
        );
        setEditCommentId(null);
        setEditCommentContent("");
        toast.success("Komentár bol úspešne upravený.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Nepodarilo sa upraviť komentár.");
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const getInitials = (name) => {
    if (!name) return ""; // Handle undefined name
    const parts = name.split(" ");
    return (parts[0]?.charAt(0) || "") + (parts[1]?.charAt(0) || "");
  };

  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
        Komentáre
      </h2>
      <div className="flex flex-col-reverse overflow-y-auto max-h-96 p-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b border-gray-300 py-4 px-2 sm:px-4"
            >
              <div className="flex items-center mb-2">
                {comment.user.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_APP_API_URL}${
                      comment.user.avatar
                    }`}
                    alt="Avatar"
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 mr-2 border-2 border-gray-400 object-cover"
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 sm:w-10 sm:h-10 mr-2 border-2 border-gray-400 flex items-center justify-center bg-green-700 text-white text-sm sm:text-lg">
                    {getInitials(
                      comment.user.firstName + " " + comment.user.lastName
                    )}
                  </div>
                )}
                <p className="font-semibold text-sm sm:text-base">
                  {currentUser && currentUser._id === comment.user._id
                    ? "Vy"
                    : `${comment.user.firstName} ${comment.user.lastName}`}
                </p>
              </div>

              {editCommentId === comment._id ? (
                <div className="mb-2">
                  <textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm sm:text-base"
                  />
                  <button
                    onClick={() => saveEditedComment(comment._id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Uložiť
                  </button>
                  <button
                    onClick={() => setEditCommentId(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Zrušiť
                  </button>
                </div>
              ) : (
                <p className="text-sm sm:text-base">{comment.content}</p>
              )}

              <p className="text-xs sm:text-sm text-gray-500">
                {moment(comment.createdAt).format("D MMM YYYY, HH:mm")}
              </p>

              {currentUser && currentUser._id === comment.user._id && (
                <button
                  onClick={() =>
                    handleEditComment(comment._id, comment.content)
                  }
                  className="text-blue-600 text-xs sm:text-sm mr-4"
                >
                  Upraviť
                </button>
              )}

              {/* Replies section */}
              {comment.replies && comment.replies.length > 0 && (
                <div>
                  {comment.replies.length > 1 &&
                  !expandedReplies[comment._id] ? (
                    <>
                      <div className="border-l pl-4 mb-2 text-xs sm:text-sm">
                        <p className="font-semibold">
                          {currentUser &&
                          currentUser._id === comment.replies[0].user._id
                            ? "Vy"
                            : `${comment.replies[0].user.firstName} ${comment.replies[0].user.lastName}`}
                        </p>
                        <p>{comment.replies[0].content}</p>
                        <p className="text-xs text-gray-500">
                          {moment(comment.replies[0].createdAt).format(
                            "D MMM YYYY, HH:mm"
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="text-blue-600 text-xs sm:text-sm"
                      >
                        Zobraziť ďalšie odpovede ({comment.replies.length - 1})
                      </button>
                    </>
                  ) : (
                    <>
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="border-l pl-4 mb-2 text-xs sm:text-sm"
                        >
                          <p className="font-semibold">
                            {currentUser && currentUser._id === reply.user._id
                              ? "Vy"
                              : `${reply.user.firstName} ${reply.user.lastName}`}
                          </p>
                          <p>{reply.content}</p>
                          <p className="text-xs text-gray-500">
                            {moment(reply.createdAt).format(
                              "D MMM YYYY, HH:mm"
                            )}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="text-blue-600 text-xs sm:text-sm"
                      >
                        Skryť odpovede
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Reply input field */}
              <div className="mt-2">
                <button
                  onClick={() => toggleReplyInput(comment._id)}
                  className="text-blue-600 text-xs sm:text-sm"
                >
                  Odpovedať
                </button>
                {showReplyInput[comment._id] && (
                  <form
                    onSubmit={(e) => handleAddReply(e, comment._id)}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      value={replies[comment._id] || ""}
                      onChange={(e) =>
                        setReplies({
                          ...replies,
                          [comment._id]: e.target.value,
                        })
                      }
                      placeholder="Napíšte svoju odpoveď..."
                      className="w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 text-xs sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-1 sm:p-2 rounded text-xs sm:text-sm"
                    >
                      Odpovedať
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-xs sm:text-sm">
            Žiadne komentáre.
          </p>
        )}
        <div ref={commentsEndRef} /> {/* Anchor for scrolling */}
      </div>

      {/* New comment input */}
      <form onSubmit={handleAddComment} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Napíšte svoj komentár..."
          className="w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 text-xs sm:text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-1 sm:p-2 rounded text-xs sm:text-sm"
        >
          Pridať komentár
        </button>
      </form>
    </div>
  );
};

export default Comments;
