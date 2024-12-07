import React from "react";
import { initializeKeycloak } from "../Keycloak";

const LogoutButton = () => {
  const handleLogout = () => {
    initializeKeycloak()
      .then((keycloak) => {
        keycloak.logout(); // Leitet zum Keycloak-Logout um
      })
      .catch((err) => {
        console.error("Fehler beim Abmelden:", err);
      });
  };

  return (
    <button onClick={handleLogout}>Abmelden</button>
  );
};

export default LogoutButton;
