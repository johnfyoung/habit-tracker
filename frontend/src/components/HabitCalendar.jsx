import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 600px;
  background: white;
  border: 1px solid #a0a096;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.125em;
  border-radius: 8px;
  overflow: hidden;

  .react-calendar__navigation {
    background-color: #f0f0f0;
  }

  .react-calendar__navigation__label {
    color: #333;
    font-weight: bold;
  }

  .react-calendar__navigation__arrow {
    color: #333;
  }

  .react-calendar__tile {
    color: black;
    background: none;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--now {
    background: none;
    color: black;
  }

  .habit-completed {
    background-color: #4caf50 !important;
    color: white !important;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
`;

const BackButton = styled.button`
  margin-bottom: 20px;
`;

const HabitTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 20px;
`;

function HabitCalendar({ habits, setHabits }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  const habit = habits.find(h => h._id === id);

  if (!habit) {
    return <div>Habit not found</div>;
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return habit.completedDates.includes(dateString) ? 'habit-completed' : null;
    }
  };

  const toggleHabitCompletion = async (value) => {
    const clickedDate = value.toISOString().split('T')[0];
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/habits/${habit._id}/toggle`, 
        { date: clickedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedHabit = response.data;
      
      setHabits(habits.map(h => h._id === habit._id ? updatedHabit : h));
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  return (
    <CalendarContainer>
      <BackButton onClick={() => navigate('/habits')}>Back to Habits</BackButton>
      <HabitTitle>{habit.name}</HabitTitle>
      <StyledCalendar
        onChange={toggleHabitCompletion}
        value={date}
        tileClassName={tileClassName}
      />
    </CalendarContainer>
  );
}

export default HabitCalendar;