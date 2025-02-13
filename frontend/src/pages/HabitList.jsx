import React, { useState } from "react";
import styled from "styled-components";
import HabitTask from "../components/HabitTask";
import { authApi } from "../utils/api";
import { convertUTCDateToLocalDate, formatDate } from "../utils/date";
import {
  isHabitCompleted,
  getLastCompletedDate,
  wasHabitCompletedOnThisDate,
} from "../utils/habit";

const HabitListContainer = styled.div`
  position: relative;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const HorizontalCalendarWrapper = styled.div`
  position: sticky;
  top: 0;
  background: var(--light-bg-color);
  padding-bottom: 1rem;
  z-index: 2;
  @media (prefers-color-scheme: dark) {
    background: var(--dark-bg-color);
  }
`;

const MonthIndicator = styled.div`
  padding: 0.5rem 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--light-primary-color);

  @media (prefers-color-scheme: dark) {
    color: var(--dark-primary-color);
  }
`;

const HorizontalCalendar = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0.5rem 0;
  gap: 0.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
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
  const [visibleDays, setVisibleDays] = useState(30);
  const [currentMonth, setCurrentMonth] = useState("");
  const [scrollRight, setScrollRight] = useState(0);
  const [isSettingScrollPosition, setIsSettingScrollPosition] = useState(false);
  const calendarRef = React.useRef(null);
  const isInitialMount = React.useRef(true);

  // Generate days for the horizontal calendar
  const getDays = () => {
    const days = [];
    const today = new Date();

    // Generate only past days and today
    for (let i = visibleDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Calculate visible month based on scroll position
  const calculateVisibleMonth = () => {
    if (!calendarRef.current) return;

    const element = calendarRef.current;
    const scrollPosition = element.scrollLeft;
    const dateElements = Array.from(element.children);

    if (dateElements.length === 0) return;

    // Find the first fully visible date element
    const elementWidth = dateElements[0].offsetWidth;
    const visibleIndex = Math.floor(scrollPosition / elementWidth);

    // Get the date from the button's key attribute
    const visibleDateElement = dateElements[visibleIndex];
    if (!visibleDateElement) return;

    const dateString = visibleDateElement.getAttribute("data-date");
    if (!dateString) return;

    const visibleDate = new Date(dateString);
    const monthYear = visibleDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    setCurrentMonth(monthYear);
  };

  // Handle scroll to load more dates
  const handleScroll = (e) => {
    const element = e.target;
    if (!isSettingScrollPosition) {
      const isNearStart = element.scrollLeft < 100;
      if (isNearStart) {
        setIsSettingScrollPosition(true);
        setScrollRight(element.scrollWidth - element.scrollLeft);
        setVisibleDays((prev) => prev + 30);
      }
    }

    calculateVisibleMonth();
  };

  // Add resize event listener
  React.useEffect(() => {
    const handleResize = () => {
      calculateVisibleMonth();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to the end (current day) when component mounts
  // OR maintain scroll position when loading more days
  React.useEffect(() => {
    if (!calendarRef.current) return;

    if (isInitialMount.current) {
      // Initial mount - scroll to end
      calendarRef.current.scrollLeft = calendarRef.current.scrollWidth;
      calculateVisibleMonth();
      isInitialMount.current = false;
    } else {
      // Loading more days - maintain relative scroll position
      const scrollWidth = calendarRef.current.scrollWidth;
      const maxWidth = calendarRef.current.clientWidth;
      const maxScroll = scrollWidth - maxWidth;
      calendarRef.current.scrollLeft = maxScroll - scrollRight;
      calculateVisibleMonth();
      setIsSettingScrollPosition(false);
    }
  }, [visibleDays]);

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
  );

  const monthlyCompletedHabits = activeHabits.filter(
    (habit) =>
      habit.frequency === "monthly" && isHabitCompleted(habit, selectedDate)
  );

  // Handle date selection in the horizontal calendar
  const handleDateSelect = (date) => {
    console.log(`selected date: ${date}`);
    setSelectedDate(date);
  };

  // Toggle habit completion using the selected date
  const toggleHabitCompletion = async (habitId, comment) => {
    try {
      const date = selectedDate; // Use the selected date
      // Call your API or function to toggle the habit completion
      await onHabitTracked(habitId, date, comment);
    } catch (error) {
      console.error("Error toggling habit completion:", error);
    }
  };

  return (
    <HabitListContainer>
      <HorizontalCalendarWrapper>
        <MonthIndicator>{currentMonth}</MonthIndicator>
        <HorizontalCalendar ref={calendarRef} onScroll={handleScroll}>
          {getDays().map((date) => (
            <DateButton
              key={date.toISOString()}
              data-date={date.toISOString()}
              selected={date.toDateString() === selectedDate.toDateString()}
              onClick={() => handleDateSelect(date)}
            >
              <span className="day-name">{getDayName(date)}</span>
              <span className="day-number">{date.getDate()}</span>
            </DateButton>
          ))}
        </HorizontalCalendar>
      </HorizontalCalendarWrapper>

      <Section>
        <SectionTitle>To Do</SectionTitle>
        {todoHabits.map((habit) => (
          <HabitTask
            key={habit._id}
            habit={habit}
            onHabitTracked={toggleHabitCompletion}
            isCompleted={false}
            lastCompletedDate={null}
            onArchiveToggle={handleArchiveToggle}
            selectedDate={selectedDate}
          />
        ))}
      </Section>

      {todayCompletedHabits.length > 0 && (
        <Section>
          <SectionTitle>Completed Daily Habits</SectionTitle>
          {todayCompletedHabits.map((habit) => (
            <HabitTask
              key={habit._id}
              habit={habit}
              onHabitTracked={toggleHabitCompletion}
              isCompleted={true}
              lastCompletedDate={formatDate(selectedDate)}
              onArchiveToggle={handleArchiveToggle}
              selectedDate={selectedDate}
            />
          ))}
        </Section>
      )}

      {weeklyCompletedHabits.length > 0 && (
        <Section>
          <SectionTitle>Completed Weekly Habits</SectionTitle>
          {weeklyCompletedHabits.map((habit) => {
            const lastCompletion = habit.completions
              ?.filter((completion) =>
                isInCurrentWeek(new Date(completion.date))
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return (
              <HabitTask
                key={habit._id}
                habit={habit}
                onHabitTracked={toggleHabitCompletion}
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
      )}

      {monthlyCompletedHabits.length > 0 && (
        <Section>
          <SectionTitle>Completed Monthly Habits</SectionTitle>
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
                onHabitTracked={toggleHabitCompletion}
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
      )}
    </HabitListContainer>
  );
}

export default HabitList;
