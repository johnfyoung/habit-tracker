import React, { useState, useEffect } from "react";
import { authApi } from "../utils/api";
import styled from "styled-components"; // Import styled-components
import Alert from "./Alert"; // Import the Alert component

// Styled components similar to HabitForm
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

function UserProfile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [currentName, setCurrentName] = useState("");

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.get(`/user/profile`);
        console.log(response);
        setName(response.data.username || ""); // Use empty string if name is undefined
        setCurrentName(response.data.username || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setAlert({ message: "Error fetching user profile", type: "error" });
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await authApi.put(`/user/profile`, { name, password });
      setAlert({ message: "Profile updated successfully!", type: "success" });
      setCurrentName(name);
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({ message: "Error updating profile", type: "error" });
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  return (
    <FormContainer>
      <h2>User Profile: {currentName}</h2>
      <Input
        type="text"
        placeholder="Name"
        value={name || ""} // Ensure value is never undefined
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Leave blank to keep the same password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleUpdate}>Update Profile</Button>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={handleCloseAlert}
        />
      )}
    </FormContainer>
  );
}

export default UserProfile;
