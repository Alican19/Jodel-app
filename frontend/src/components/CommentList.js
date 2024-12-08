import React, { useEffect, useState } from "react";
import axios from "axios";
import { initializeKeycloak } from "../Keycloak"; // Beispiel: Deine Keycloak-Initialisierung

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("anonymous");

  // Keycloak initialisieren und Benutzerinformationen abrufen
  useEffect(() => {
    initializeKeycloak()
      .then((keycloak) => {
        if (keycloak.authenticated) {
          setUsername(keycloak.tokenParsed?.preferred_username || "anonymous");
        }
      })
      .catch((err) => {
        console.error("Failed to initialize Keycloak", err);
      });
  }, []);

  // Kommentare für den spezifischen Post abrufen
  useEffect(() => {
    axios
      .get(`http://localhost:8080/posts/${postId}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
      });
  }, [postId]);

  // Kommentar speichern
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    axios
      .post(
        `http://localhost:8080/posts/${postId}/comments`,
        {
          userId: username, // Verwende den Benutzernamen aus Keycloak
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("kc_token")}`, // Token aus LocalStorage oder Session
          },
        }
      )
      .then((response) => {
        setComments((prev) => [...prev, response.data]);
        setNewComment("");
      })
      .catch((err) => {
        console.error("Failed to add comment:", err);
      });
  };

  return (
    <div style={{ marginTop: "10px", paddingLeft: "20px", borderLeft: "2px solid #ccc" }}>
      <h4>Kommentare</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} (von {comment.userId})
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Schreibe einen Kommentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          style={{ width: "80%", marginRight: "10px" }}
        />
        <button type="submit">Posten</button>
      </form>
    </div>
  );
};

export default CommentList;
