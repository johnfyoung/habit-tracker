import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import HabitCalendar from './components/HabitCalendar';
import HabitArchive from './components/HabitArchive';
import Register from './components/Register';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Alert from './components/Alert';
import GlobalStyles from './GlobalStyles';

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
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Content = styled.main`
  width: 100%;
  max-width: 800px;
`;

function App() {
  const [habits, setHabits] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
          fetchHabits();
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/habits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched habits:', response.data);
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = async (habit) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/habits', habit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
      showAlert('Habit added successfully!', 'success');
    } catch (error) {
      console.error('Error adding habit:', error);
      showAlert('Failed to add habit', 'error');
    }
  };

  const handleHabitTracked = async (habitId) => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      console.log(`Toggling habit ${habitId} for date ${today}`);
      const response = await axios.post(`/api/habits/${habitId}/toggle`, 
        { date: today },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Habit toggled:', response.data);
      setHabits(habits.map(habit => 
        habit._id === habitId ? response.data : habit
      ));
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchHabits();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHabits([]);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 5000); // Hide alert after 5 seconds
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Banner>
          <Title>Get It Done</Title>
          {isAuthenticated && <NavBar onLogout={handleLogout} />}
        </Banner>
        {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />}
        <ContentWrapper>
          <Content>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route 
                path="/habits" 
                element={
                  isAuthenticated ? (
                    <HabitList habits={habits.filter(h => !h.archived)} setHabits={setHabits} onHabitTracked={handleHabitTracked} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/habit/:id" 
                element={
                  isAuthenticated ? (
                    <HabitCalendar habits={habits} setHabits={setHabits} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/archive" 
                element={
                  isAuthenticated ? (
                    <HabitArchive habits={habits} setHabits={setHabits} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route path="/" element={<Navigate to="/habits" replace />} />
            </Routes>
          </Content>
        </ContentWrapper>
      </AppContainer>
    </Router>
  );
}

export default App;
