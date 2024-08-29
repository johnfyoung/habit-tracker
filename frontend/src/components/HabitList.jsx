import React from 'react';
import styled from 'styled-components';

const HabitListContainer = styled.div`
  margin-top: 2rem;
`;

const HabitItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const HabitName = styled.h3`
  color: #2196f3;
  margin: 0 0 0.5rem 0;
`;

const HabitFrequency = styled.p`
  color: #757575;
  margin: 0;
`;

const ActionButton = styled.button`
  background-color: ${props => props.completed ? '#4caf50' : '#2196f3'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.completed ? '#45a049' : '#1e88e5'};
  }
`;

const PageTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
`;

const getLastCompletedDate = (completedDates) => {
  if (!completedDates || completedDates.length === 0) {
    return 'Not completed yet';
  }
  const lastDate = new Date(Math.max(...completedDates.map(d => new Date(d + 'T00:00:00Z').getTime())));
  return lastDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
};

const LastCompletedDate = styled.p`
  color: #4caf50;
  margin: 0 0 0.5rem 0;
  font-size: 0.9em;
`;

function HabitList({ habits, onHabitTracked }) {
  const isHabitCompleted = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) {
      console.log(`${habit.name}: No completed dates`);
      return false;
    }

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const todayString = todayUTC.toISOString().split('T')[0];
    console.log(`${habit.name}: Checking completion for ${todayString}`);

    switch (habit.frequency.toLowerCase()) {
      case 'daily':
        const completedToday = habit.completedDates.some(date => {
          const dateUTC = new Date(date + 'T00:00:00Z');
          const dateString = dateUTC.toISOString().split('T')[0];
          console.log(`${habit.name}: Comparing ${dateString} with ${todayString}`);
          return dateString === todayString;
        });
        console.log(`${habit.name}: Completed today: ${completedToday}`);
        return completedToday;
      case 'weekly':
        const weekStartUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - todayUTC.getUTCDay()));
        return habit.completedDates.some(date => new Date(date + 'T00:00:00Z') >= weekStartUTC);
      case 'monthly':
        return habit.completedDates.some(date => {
          const completedDateUTC = new Date(date + 'T00:00:00Z');
          console.log(`${habit.name}: Completed date: ${completedDateUTC.toISOString()}`);
          console.log(`${habit.name}: Completed month: ${completedDateUTC.getUTCMonth()} === ${todayUTC.getUTCMonth()}`);
          return completedDateUTC.getUTCMonth() === todayUTC.getUTCMonth() &&
                 completedDateUTC.getUTCFullYear() === todayUTC.getUTCFullYear();
        });
      default:
        return false;
    }
  };

  return (
    <HabitListContainer>
      <PageTitle>Your Habits</PageTitle>
      {habits.map((habit) => {
        console.log(`Checking habit: ${habit.name}`, habit);
        const completed = isHabitCompleted(habit);
        const lastCompletedDate = getLastCompletedDate(habit.completedDates);
        return (
          <HabitItem key={habit._id}>
            <HabitName>{habit.name}</HabitName>
            <HabitFrequency>Frequency: {habit.frequency}</HabitFrequency>
            <LastCompletedDate>Last completed: {lastCompletedDate}</LastCompletedDate>
            <ActionButton 
              onClick={() => onHabitTracked(habit._id)}
              completed={completed}
            >
              {completed ? 'Undo' : 'Track'}
            </ActionButton>
          </HabitItem>
        );
      })}
    </HabitListContainer>
  );
}

export default HabitList;
