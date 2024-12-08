import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Kommentare für den Post laden
    axios
      .get(`http://localhost:8080/comments/${postId}`)
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    axios
      .post("http://localhost:8080/comments", {
        text: newComment,
        post: { id: postId },
      })
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment("");
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  return (
    <div>
      <h3>Kommentare</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Schreibe einen Kommentar..."
      />
      <button onClick={handleAddComment}>Kommentar hinzufügen</button>
    </div>
  );
};

export default CommentList;