import React, { useEffect, useState } from "react";
import axios from "axios";
import { initializeKeycloak } from "../Keycloak";

const LatestZahl = () => {
  const [zahl, setZahl] = useState(null); // Die Zahl aus der Datenbank
  const [error, setError] = useState(null); // Fehleranzeige
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    // Keycloak-Authentifizierung starten
    initializeKeycloak()
      .then((keycloak) => {
        console.log("Keycloak erfolgreich initialisiert:", keycloak.authenticated);
        setKeycloakInitialized(true);

        // Backend-Daten laden
        axios
          .get("http://localhost:8080/latest-zahl", {
            headers: { Authorization: `Bearer ${keycloak.token}` }, // Token aus Keycloak
          })
          .then((response) => {
            setZahl(response.data); // Zahl aus der API setzen
          })
          .catch((err) => {
            console.error("Fehler beim Abrufen der Daten:", err);
            setError("Daten konnten nicht geladen werden.");
          });
      })
      .catch((err) => {
        console.error("Keycloak-Fehler:", err);
        setError("Authentifizierung fehlgeschlagen.");
      });
  }, []);

  return (
    <div>
      <h1>Letzte Zahl aus der Datenbank:</h1>
      {!keycloakInitialized && <p>Keycloak wird initialisiert...</p>}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <h2>{zahl !== null ? zahl : "Wird geladen..."}</h2>
      )}
    </div>
  );
};

export default LatestZahl;
