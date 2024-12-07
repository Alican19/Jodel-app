import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
