import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentList from "./CommentList"; // Import der CommentList-Komponente

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [openComments, setOpenComments] = useState({}); // State für offene Kommentar-Sektionen

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
  }, [latitude, longitude]);

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <h1>Nearby Posts</h1>
      {locationError && <p style={{ color: "red" }}>{locationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!latitude || !longitude ? (
        <p>Position wird ermittelt...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "20px" }}>
              <p>{post.content}</p>
              <small>
                Gepostet von: {post.userId} in {post.latitude}, {post.longitude}
              </small>
              {/* Button zum Ein- und Ausklappen der Kommentare */}
              <button onClick={() => toggleComments(post.id)}>
                {openComments[post.id] ? "Kommentare ausblenden" : "Kommentare anzeigen"}
              </button>
              {/* Kommentar-Sektion anzeigen, wenn geöffnet */}
              {openComments[post.id] && <CommentList postId={post.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
