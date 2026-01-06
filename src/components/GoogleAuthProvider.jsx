/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthProvider = ({ children }) => {
  // Production ও Development এর জন্য আলাদা Client ID
  const getClientId = () => {
    // আপনার Production Client ID
    const productionClientId =
      "769547170960-t71tahq8bcvi84qg5ig33j8uktsvn3ag.apps.googleusercontent.com";

    // Environment থেকে Client ID (যদি থাকে)
    const envClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

    // Hostname ভিত্তিতে Client ID সিলেক্ট
    const hostname = window.location.hostname;

    console.log("Hostname:", hostname);
    console.log("Using Client ID:", productionClientId);

    // সবক্ষেত্রে Production Client ID ব্যবহার করছি
    return productionClientId;
  };

  const clientId = getClientId();

  if (!clientId) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "5px",
          margin: "20px",
        }}
      >
        <h2 style={{ color: "#856404" }}>⚠️ Configuration Error</h2>
        <p>Google Client ID not configured. Please check .env file.</p>
        <p
          style={{
            fontFamily: "monospace",
            background: "#f8f9fa",
            padding: "10px",
          }}
        >
          VITE_GOOGLE_CLIENT_ID=1032508975210-mckmo05u85nuic8gt8rg8h70tqab4vh0.apps.googleusercontent.com
        </p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
