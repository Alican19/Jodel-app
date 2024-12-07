import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081", // Keycloak-Server-URL
  realm: "my-realm",            // Dein Realm-Name
  clientId: "frontend-app",     // Deine Client-ID aus Keycloak
});

let initialized = false; // Variable, um sicherzustellen, dass Keycloak nur einmal initialisiert wird

export const initializeKeycloak = () => {
  if (!initialized) {
    initialized = true;
    return keycloak.init({ onLoad: "login-required" }).then(() => keycloak);
  }
  return Promise.resolve(keycloak);
};

export default keycloak;
