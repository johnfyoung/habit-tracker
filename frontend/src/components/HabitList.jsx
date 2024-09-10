import React from 'react';
import styled from 'styled-components';
import HabitTask from './HabitTask';

const HabitListContainer = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

function HabitList({ habits, onHabitTracked }) {
  const isHabitCompleted = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) {
      return false;
    }

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const todayString = todayUTC.toISOString().split('T')[0];

    switch (habit.frequency.toLowerCase()) {
      case 'daily':
        return habit.completedDates.some(date => {
          const dateUTC = new Date(date + 'T00:00:00Z');
          const dateString = dateUTC.toISOString().split('T')[0];
          return dateString === todayString;
        });
      case 'weekly':
        const weekStartUTC = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate() - todayUTC.getUTCDay()));
        return habit.completedDates.some(date => new Date(date + 'T00:00:00Z') >= weekStartUTC);
      case 'monthly':
        return habit.completedDates.some(date => {
          const completedDateUTC = new Date(date + 'T00:00:00Z');
          return completedDateUTC.getUTCMonth() === todayUTC.getUTCMonth() &&
                 completedDateUTC.getUTCFullYear() === todayUTC.getUTCFullYear();
        });
      default:
        return false;
    }
  };

  const getLastCompletedDate = (completedDates) => {
    if (!completedDates || completedDates.length === 0) {
      return null;
    }
    return new Date(Math.max(...completedDates.map(d => new Date(d + 'T00:00:00Z').getTime())));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  const todoHabits = habits.filter(habit => !isHabitCompleted(habit));
  const completedHabits = habits
    .filter(habit => isHabitCompleted(habit))
    .sort((a, b) => {
      const dateA = getLastCompletedDate(a.completedDates);
      const dateB = getLastCompletedDate(b.completedDates);
      return dateB - dateA; // Sort in descending order (most recent first)
    });

  return (
    <HabitListContainer>
      <Section>
        <SectionTitle>To Do</SectionTitle>
        {todoHabits.map((habit) => (
          <HabitTask
            key={habit._id}
            habit={habit}
            onHabitTracked={onHabitTracked}
            isCompleted={false}
            lastCompletedDate={null}
          />
        ))}
      </Section>
      <Section>
        <SectionTitle>Completed</SectionTitle>
        {completedHabits.map((habit) => {
          const lastCompletedDate = getLastCompletedDate(habit.completedDates);
          return (
            <HabitTask
              key={habit._id}
              habit={habit}
              onHabitTracked={onHabitTracked}
              isCompleted={true}
              lastCompletedDate={lastCompletedDate ? formatDate(lastCompletedDate) : null}
            />
          );
        })}
      </Section>
    </HabitListContainer>
  );
}

export default HabitList;
