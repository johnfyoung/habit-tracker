import React from "react";
import styled from "styled-components";
import HabitTask from "./HabitTask";
import { authApi } from "../utils/api";
import { convertUTCDateToLocalDate } from "../utils/date";

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
  const isHabitCompleted = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) {
      return false;
    }

    const todayLocal = new Date();
    const todayLocalString = todayLocal.toISOString().split("T")[0];

    switch (habit.frequency.toLowerCase()) {
      case "daily":
        return habit.completedDates.some((date) => {
          const dateLocal = convertUTCDateToLocalDate(new Date(date));
          const dateLocalString = dateLocal.toISOString().split("T")[0];
          return dateLocalString === todayLocalString;
        });
      case "weekly":
        const weekStartLocal = new Date(
          todayLocal.getFullYear(),
          todayLocal.getMonth(),
          todayLocal.getDate() - todayLocal.getDay()
        );
        return habit.completedDates.some(
          (date) => convertUTCDateToLocalDate(new Date(date)) >= weekStartLocal
        );
      case "monthly":
        return habit.completedDates.some((date) => {
          const completedDateLocal = convertUTCDateToLocalDate(new Date(date));
          return (
            completedDateLocal.getMonth() === todayLocal.getMonth() &&
            completedDateLocal.getFullYear() === todayLocal.getFullYear()
          );
        });
      default:
        return false;
    }
  };

  const getLastCompletedDate = (completedDates) => {
    if (!completedDates || completedDates.length === 0) {
      return null;
    }
    return new Date(
      Math.max(...completedDates.map((d) => new Date(d).getTime()))
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { timeZone: "UTC" });
  };

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
          const lastCompletedDate = getLastCompletedDate(habit.completedDates);
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
