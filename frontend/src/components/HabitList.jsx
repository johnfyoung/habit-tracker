import React from "react";
import styled from "styled-components";
import HabitTask from "./HabitTask";
import { authApi } from "../utils/api";
import { convertUTCDateToLocalDate, formatDate } from "../utils/date";
import { isHabitCompleted, getLastCompletedDate } from "../utils/habit";

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

function HabitList({ habits, setHabits, onHabitTracked }) {
  const handleArchiveToggle = async (habitId) => {
    try {
      const response = await authApi.post(`/habits/${habitId}/toggle-archive`);
      const updatedHabit = response.data;
      setHabits(habits.map((h) => (h._id === habitId ? updatedHabit : h)));
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const activeHabits = habits.filter((habit) => !habit.archived);
  const todoHabits = activeHabits.filter((habit) => !isHabitCompleted(habit));
  const completedHabits = activeHabits.filter((habit) =>
    isHabitCompleted(habit)
  );

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
            onArchiveToggle={handleArchiveToggle}
          />
        ))}
      </Section>
      <Section>
        <SectionTitle>Completed</SectionTitle>
        {completedHabits.map((habit) => {
          const lastCompletedDate = getLastCompletedDate(habit);
          return (
            <HabitTask
              key={habit._id}
              habit={habit}
              onHabitTracked={onHabitTracked}
              isCompleted={true}
              lastCompletedDate={
                lastCompletedDate ? formatDate(lastCompletedDate) : null
              }
              onArchiveToggle={handleArchiveToggle}
            />
          );
        })}
      </Section>
    </HabitListContainer>
  );
}

export default HabitList;
