import React, { useState, useEffect } from "react";
import axios from "axios";
import { initializeKeycloak } from "../Keycloak";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (latitude === null || longitude === null) {
      setMessage("Position wird noch ermittelt. Bitte warte einen Moment.");
      return;
    }
  
    initializeKeycloak()
      .then((keycloak) => {
        const username = keycloak.tokenParsed.preferred_username || "unknown-user"; // Benutzernamen auslesen
        console.log("Angemeldeter Benutzer:", username);
  
        axios
          .post(
            "http://localhost:8080/posts",
            {
              userId: username, // Benutzernamen verwenden
              content,
              latitude,
              longitude,
            },
            {
              headers: { Authorization: `Bearer ${keycloak.token}` }, // Token hinzufügen
            }
          )
          .then(() => {
            setMessage("Post created successfully!");
            setContent("");
          })
          .catch((err) => {
            console.error("Error creating post:", err);
            setMessage("Failed to create post.");
          });
      })
      .catch((err) => {
        console.error("Keycloak-Fehler:", err);
        setMessage("Authentifizierung fehlgeschlagen.");
      });
  };
  

  return (
    <div>
      <h1>Create a New Post</h1>
      {locationError && <p style={{ color: "red" }}>{locationError}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit" disabled={latitude === null || longitude === null}>
          Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;
