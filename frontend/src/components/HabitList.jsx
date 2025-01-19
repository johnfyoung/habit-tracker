import React, { useState } from "react";
import styled from "styled-components";
import HabitTask from "./HabitTask";
import { authApi } from "../utils/api";
import { convertUTCDateToLocalDate, formatDate } from "../utils/date";
import {
  isHabitCompleted,
  getLastCompletedDate,
  wasHabitCompletedOnThisDate,
} from "../utils/habit";

const HabitListContainer = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const HorizontalCalendar = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DateButton = styled.button`
  min-width: 4rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) =>
    props.selected ? "var(--light-primary-color)" : "#f9f9f9"};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: 1px solid #ddd;
  cursor: pointer;
  flex-shrink: 0;

  .day-name {
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .day-number {
    font-size: 1.2rem;
    font-weight: bold;
  }

  @media (prefers-color-scheme: dark) {
    background: ${(props) =>
      props.selected ? "var(--dark-primary-color)" : "#333"};
    color: ${(props) => (props.selected ? "black" : "white")};
  }
`;

function HabitList({ habits, setHabits, onHabitTracked }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate last 7 days for the horizontal calendar
  const getDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Format day name
  const getDayName = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
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

  const isInCurrentWeek = (date) => {
    const now = selectedDate;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isInCurrentMonth = (date) => {
    const now = selectedDate;
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const activeHabits = habits.filter((habit) => !habit.archived);

  const todoHabits = activeHabits.filter(
    (habit) => !isHabitCompleted(habit, selectedDate)
  );

  const todayCompletedHabits = activeHabits.filter(
    (habit) =>
      habit.frequency === "daily" && isHabitCompleted(habit, selectedDate)
  );

  const weeklyCompletedHabits = activeHabits.filter(
    (habit) =>
      habit.frequency === "weekly" && isHabitCompleted(habit, selectedDate)
    // habit.completions?.some((completion) => {
    //   const completionDate = new Date(completion.date);
    //   return (
    //     isInCurrentWeek(completionDate) &&
    //     completionDate.toDateString() !== selectedDate.toDateString()
    //   );
    // })
  );

  const monthlyCompletedHabits = activeHabits.filter(
    (habit) =>
      habit.frequency === "monthly" && isHabitCompleted(habit, selectedDate)
  );

  return (
    <HabitListContainer>
      <HorizontalCalendar>
        {getDays().map((date) => (
          <DateButton
            key={date.toISOString()}
            selected={date.toDateString() === selectedDate.toDateString()}
            onClick={() => setSelectedDate(date)}
          >
            <span className="day-name">{getDayName(date)}</span>
            <span className="day-number">{date.getDate()}</span>
          </DateButton>
        ))}
      </HorizontalCalendar>

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
            selectedDate={selectedDate}
          />
        ))}
      </Section>

      <Section>
        <SectionTitle>Completed Today</SectionTitle>
        {todayCompletedHabits.map((habit) => (
          <HabitTask
            key={habit._id}
            habit={habit}
            onHabitTracked={onHabitTracked}
            isCompleted={true}
            lastCompletedDate={formatDate(selectedDate)}
            onArchiveToggle={handleArchiveToggle}
            selectedDate={selectedDate}
          />
        ))}
      </Section>

      <Section>
        <SectionTitle>Completed This Week</SectionTitle>
        {weeklyCompletedHabits.map((habit) => {
          const lastCompletion = habit.completions
            ?.filter((completion) => isInCurrentWeek(new Date(completion.date)))
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          return (
            <HabitTask
              key={habit._id}
              habit={habit}
              onHabitTracked={onHabitTracked}
              isCompleted={true}
              lastCompletedDate={
                lastCompletion
                  ? formatDate(new Date(lastCompletion.date))
                  : null
              }
              onArchiveToggle={handleArchiveToggle}
              selectedDate={selectedDate}
            />
          );
        })}
      </Section>

      <Section>
        <SectionTitle>Completed This Month</SectionTitle>
        {monthlyCompletedHabits.map((habit) => {
          const lastCompletion = habit.completions
            ?.filter((completion) =>
              isInCurrentMonth(new Date(completion.date))
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          return (
            <HabitTask
              key={habit._id}
              habit={habit}
              onHabitTracked={onHabitTracked}
              isCompleted={true}
              lastCompletedDate={
                lastCompletion
                  ? formatDate(new Date(lastCompletion.date))
                  : null
              }
              onArchiveToggle={handleArchiveToggle}
              selectedDate={selectedDate}
            />
          );
        })}
      </Section>
    </HabitListContainer>
  );
}

export default HabitList;
