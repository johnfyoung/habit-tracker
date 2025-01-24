import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import { api, authApi } from "./utils/api";
import styled from "styled-components";
import HabitList from "./pages/HabitList";
import HabitForm from "./pages/HabitForm";
import Habit from "./pages/Habit";
import HabitArchive from "./pages/HabitArchive";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import NavBar from "./components/NavBar";
import Alert from "./components/Alert";
import GlobalStyles from "./GlobalStyles";
import LoadingScreen from "./components/LoadingScreen";
import { useMediaQuery } from "react-responsive";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Banner = styled.header`
  background-color: #2196f3;
  color: white;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-bottom: 4rem;
`;

const Content = styled.main`
  width: 100%;
  max-width: 800px;
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2196f3;
  padding: 0.75rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const FooterLink = styled(Link)`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
`;

function App() {
  const [habits, setHabits] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [alertTimeout, setAlertTimeout] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await authApi.get("/auth/verify");
          setIsAuthenticated(true);
          fetchHabits();
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await authApi.get("/habits");
      console.log("Fetched habits:", response.data);
      setHabits(response.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const addHabit = async (habit) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      await authApi.post("/habits", { ...habit, userId });
      fetchHabits();
      showAlert("Habit added successfully!", "success");
    } catch (error) {
      console.error("Error adding habit:", error);
      showAlert("Failed to add habit", "error");
    }
  };

  const handleHabitTracked = async (habitId, localDate) => {
    try {
      const today = localDate || new Date();
      const todayStr = today.toISOString();
      console.log(`Toggling habit ${habitId} for date ${todayStr}`);
      const response = await authApi.post(`/habits/${habitId}/toggle`, {
        date: todayStr,
      });
      console.log("Habit toggled:", response.data);
      console.log("Habits before update:", habits);
      setHabits(
        habits.map((habit) => (habit._id === habitId ? response.data : habit))
      );
      console.log("Habits after update:", habits);
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchHabits();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setHabits([]);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000); // Hide alert after 5 seconds
  };

  if (isLoading) {
    return (
      <>
        <GlobalStyles />
        <LoadingScreen />
      </>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppContent
          isAuthenticated={isAuthenticated}
          isMobile={isMobile}
          alert={alert}
          setAlert={setAlert}
          habits={habits}
          setHabits={setHabits}
          handleLogout={handleLogout}
          handleLogin={handleLogin}
          addHabit={addHabit}
          handleHabitTracked={handleHabitTracked}
        />
      ),
      children: [
        {
          index: true,
          element: isAuthenticated ? (
            <HabitList habits={habits} onHabitTracked={handleHabitTracked} />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "register",
          element: !isAuthenticated ? (
            <Register showAlert={showAlert} onLogin={handleLogin} />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "login",
          element: !isAuthenticated ? (
            <Login showAlert={showAlert} onLogin={handleLogin} />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "profile",
          element: isAuthenticated ? (
            <UserProfile showAlert={showAlert} />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "archive",
          element: isAuthenticated ? (
            <HabitArchive habits={habits} />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "add",
          element: isAuthenticated ? (
            <HabitForm addHabit={addHabit} />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "habit/:id",
          element: isAuthenticated ? (
            <Habit
              habits={habits}
              setHabits={setHabits}
              onHabitTracked={handleHabitTracked}
              showAlert={showAlert}
            />
          ) : (
            <Navigate to="/login" />
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
}

function AppContent({
  isAuthenticated,
  isMobile,
  alert,
  setAlert,
  habits,
  setHabits,
  handleLogout,
  handleLogin,
  addHabit,
  handleHabitTracked,
}) {
  return (
    <AppContainer>
      {!isMobile && (
        <Banner>
          <Title>Habit Tracker</Title>
          <NavBar
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            isMobile={isMobile}
            $standalone={false}
          />
        </Banner>
      )}
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <ContentWrapper>
        <Content>
          <Outlet />
        </Content>
      </ContentWrapper>
      {isMobile && isAuthenticated && (
        <Footer>
          <FooterLink to="/">
            <span>Habits</span>
          </FooterLink>
          <FooterLink to="/add">
            <span>Add</span>
          </FooterLink>
          <FooterLink to="/archive">
            <span>Archive</span>
          </FooterLink>
          <FooterLink to="/profile">
            <span>Profile</span>
          </FooterLink>
        </Footer>
      )}
    </AppContainer>
  );
}

export default App;
