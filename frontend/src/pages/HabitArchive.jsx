import React from 'react';
import styled from 'styled-components';
import HabitTask from '../components/HabitTask';
import axios from 'axios';

const ArchiveContainer = styled.div`
  margin-top: 2rem;
`;

const PageTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
`;

function HabitArchive({ habits, setHabits }) {
  const archivedHabits = habits.filter(habit => habit.archived);

  const handleUnarchive = async (habitId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/habits/${habitId}/toggle-archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedHabit = response.data;
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
    } catch (error) {
      console.error('Error unarchiving habit:', error);
    }
  };

  return (
    <ArchiveContainer>
      <PageTitle>Archived Habits</PageTitle>
      {archivedHabits.map((habit) => (
        <HabitTask
          key={habit._id}
          habit={habit}
          isCompleted={false}
          lastCompletedDate={null}
          isArchived={true}
        />
      ))}
    </ArchiveContainer>
  );
}

export default HabitArchive;
