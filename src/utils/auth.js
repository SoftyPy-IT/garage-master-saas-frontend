import axios from "axios";

const TOKEN_KEY = "google_access_token";
const PROFILE_KEY = "google_user_profile";
const TIMESTAMP_KEY = "auth_timestamp";

export const saveAuthSession = (accessToken, userProfile) => {
  try {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

    sessionStorage.setItem(TOKEN_KEY, accessToken);
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
  } catch (error) {
    console.error("Error saving auth session:", error);
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
    localStorage.removeItem("calendar_events");

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing auth session:", error);
  }
};

export const loadAuthSession = () => {
  try {
    let token = localStorage.getItem(TOKEN_KEY);
    let profile = localStorage.getItem(PROFILE_KEY);

    if (!token || !profile) {
      token = sessionStorage.getItem(TOKEN_KEY);
      profile = sessionStorage.getItem(PROFILE_KEY);
    }

    if (token && profile) {
      return { token, profile: JSON.parse(profile) };
    }

    return null;
  } catch (error) {
    console.error("Error loading auth session:", error);
    clearAuthSession();
    return null;
  }
};

export const verifyTokenValidity = async (token) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/tokeninfo",
      {
        params: { access_token: token },
        timeout: 5000,
      },
    );

    return response.data.expires_in > 0;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};
