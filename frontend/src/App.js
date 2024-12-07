import React, { useState, useEffect } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import LogoutButton from "./components/LogoutButton"; 

function App() {
  const [hasError, setHasError] = useState(false);

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

  if (hasError) {
    return <div>Ein Fehler ist aufgetreten. Prüfe die Konsole.</div>;
  }

  return (
    <div>
      <h1>Jodel App</h1>
      {/* Formular zum Erstellen eines neuen Jodels */}
      <LogoutButton />
      <PostForm />
      <PostList />

      {/* Liste der Jodels */}
 
    </div>
  );
}

export default App;
