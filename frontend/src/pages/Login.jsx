import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import styled from "styled-components";
import Alert from "../components/Alert";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  color: inherit;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const RegisterLink = styled(Link)`
  margin-top: 1rem;
  text-align: center;
  color: #2196f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
`;

const AlertWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.alert) {
      setAlert(location.state.alert);
      // Clear the location state to prevent the alert from reappearing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      console.log("Login response:", response.data); // Add this line for debugging
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin();
      navigate("/habits");
    } catch (error) {
      console.error("Login error:", error); // Add this line for debugging
      setAlert({ message: "Login failed. Please try again.", type: "error" });
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  return (
    <FormContainer>
      <PageTitle>Login</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
      <AlertWrapper>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={handleCloseAlert}
          />
        )}
      </AlertWrapper>
      <RegisterLink to="/register">
        Don't have an account? Register here
      </RegisterLink>
    </FormContainer>
  );
}

export default Login;
