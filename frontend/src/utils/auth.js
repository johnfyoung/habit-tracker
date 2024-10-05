import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post("/api/auth/refresh-token", {
      refreshToken,
    });
    console.log("Refresh token response:", response.data); // Add this line for debugging
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

export const getValidToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token available");
  }

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp < currentTime) {
    // Token is expired, try to refresh
    return await refreshToken();
  }

  return token;
};
