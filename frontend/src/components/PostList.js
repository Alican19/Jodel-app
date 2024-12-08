import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);

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
            radius: 10000,
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
            <li key={post.id}>
              <p>{post.content}</p>
              <small>
                Posted by: {post.userId} at {post.latitude}, {post.longitude}
              </small>
              <CommentList postId={post.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;