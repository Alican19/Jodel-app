import React, { useEffect, useState } from "react";
import axios from "axios";
import '../themes/PostForm.css';  // Importiere das CSS

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Geolocation automatisch abrufen
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Fehler beim Abrufen der Position:", error);
          setLocationError("Konnte Position nicht ermitteln.");
        }
      );
    } else {
      setLocationError("Geolocation wird von deinem Browser nicht unterstützt.");
    }
  }, []);

  // Posts abrufen, wenn Geolocation bereit ist
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      axios
        .get("http://localhost:8080/posts", {
          params: {
            latitude: latitude,
            longitude: longitude,
            radius: 10000, // Radius in Metern
          },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setError("Failed to load posts.");
        });
    }
  }, [latitude, longitude]); // Läuft, wenn die Position sich ändert

  // Kommentare für einen Post laden
  const loadComments = (postId) => {
    axios
      .get(`http://localhost:8080/posts/${postId}/comments`)
      .then((response) => {
        const updatedPosts = posts.map(post =>
          post.id === postId ? { ...post, comments: response.data } : post
        );
        setPosts(updatedPosts);
      })
      .catch((err) => {
        console.error("Error loading comments:", err);
      });
  };

  // Kommentar für einen Post hinzufügen
  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    axios
      .post(
        `http://localhost:8080/posts/${postId}/comments`,
        { content: newComment },
      )
      .then(() => {
        setNewComment(""); // Kommentar-Feld leeren
        loadComments(postId); // Kommentare neu laden
      })
      .catch((err) => {
        console.error("Error posting comment:", err);
        setError("Failed to post comment.");
      });
  };

  return (
    <div>
      <h1>Nearby Posts</h1>
      {locationError && <p className="error">{locationError}</p>}
      {error && <p className="error">{error}</p>}
      {!latitude || !longitude ? (
        <p className="loading">Position wird ermittelt...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <p>{post.content}</p>
              <small>
                Posted by: {post.userId} at {post.latitude}, {post.longitude}
              </small>
              <div>
                <h3>Comments</h3>
                <ul>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <li key={index}>{comment.content}</li>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </ul>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                ></textarea>
                <button onClick={() => handleAddComment(post.id)}>
                  Add Comment
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
