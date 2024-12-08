import React, { useState, useEffect } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import LogoutButton from "./components/LogoutButton"; 
import './styles.css';

function App() {
  const [hasError, setHasError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Trigger to refresh posts

  useEffect(() => {
    const handleError = (error) => {
      console.error("Globaler Fehler:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", (e) =>
      handleError(e.reason || e)
    );

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => !prev); // Toggle refresh trigger to update posts
  };

  if (hasError) {
    return <div>Ein Fehler ist aufgetreten. Prüfe die Konsole.</div>;
  }

  return (
    <div>
      <LogoutButton />
      <h1>Jodel App</h1>
      {/* PostForm with a callback to trigger post refresh */}
      <PostForm />
      {/* PostList listens for refreshTrigger */}
      <PostList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
