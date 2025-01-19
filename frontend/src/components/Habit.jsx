import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { wasHabitCompletedOnThisDate } from "../utils/habit";
import Calendar from "react-calendar";
import styled from "styled-components";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

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
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const HabitTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 20px;
`;

const ArchiveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ArchivedNotice = styled.p`
  color: #f44336;
  font-style: italic;
  margin-top: 10px;
`;

const EditButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #1976d2;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: bold;
    color: ${(props) =>
      props.importance > 0
        ? "#4caf50"
        : props.importance < 0
        ? "#f44336"
        : "#757575"};
  }
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) =>
      props.importance > 0
        ? "#4caf50"
        : props.importance < 0
        ? "#f44336"
        : "#757575"};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) =>
      props.importance > 0
        ? "#4caf50"
        : props.importance < 0
        ? "#f44336"
        : "#757575"};
    cursor: pointer;
    border: none;
  }
`;

const Button = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1976d2;
  }
`;

const ImportanceIndicator = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: ${(props) =>
    props.importance > 0
      ? "#4caf50"
      : props.importance < 0
      ? "#f44336"
      : "#757575"};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: bold;
  }
`;

function Habit({ habits, setHabits, onHabitTracked }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImportance, setEditImportance] = useState(0);
  const userLocale = navigator.language || "en-US"; // Fallback to en-US if browser locale not available

  const habit = habits.find((h) => h._id === id);

  if (!habit) {
    return <div>Habit not found</div>;
  }

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return wasHabitCompletedOnThisDate(habit, date)
        ? "habit-completed"
        : null;
    }
  };

  const toggleHabitCompletion = async (value) => {
    if (habit.archived) {
      return; // Do nothing if the habit is archived
    }

    try {
      console.log("toggleHabitCompletion", value);
      // the date supplied by the calender is just the date, not the time
      // so we need to add a time to it
      let date = new Date(value);
      const now = new Date();
      if (now.toDateString() === date.toDateString()) {
        date = now;
      } else {
        date.setHours(12, 0, 0, 0);
      }

      console.log("date", date);
      onHabitTracked(habit._id, date);
    } catch (error) {
      console.error("Error toggling habit completion:", error);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/habits/${habit._id}/toggle-archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedHabit = response.data;
      setHabits(habits.map((h) => (h._id === habit._id ? updatedHabit : h)));
      if (updatedHabit.archived) {
        navigate("/habits");
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  // Initialize edit form when editing starts
  const handleEditClick = () => {
    setEditName(habit.name);
    setEditImportance(habit.importance);
    setIsEditing(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/habits/${habit._id}`,
        {
          name: editName,
          importance: editImportance,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update habits list with edited habit
      setHabits(habits.map((h) => (h._id === habit._id ? response.data : h)));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  return (
    <CalendarContainer>
      <BackButton onClick={() => navigate("/habits")}>
        Back to Habits
      </BackButton>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <HabitTitle>{habit.name}</HabitTitle>
          <ImportanceIndicator importance={habit.importance}>
            Importance: <span>{habit.importance}</span>
          </ImportanceIndicator>
        </div>
        <EditButton onClick={handleEditClick}>Edit</EditButton>
      </div>

      {isEditing && (
        <EditForm onSubmit={handleEditSubmit}>
          <Input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Habit name"
            required
          />
          <SliderContainer>
            <SliderLabel importance={editImportance}>
              Habit Importance <span>{editImportance}</span>
            </SliderLabel>
            <Slider
              type="range"
              min="-10"
              max="10"
              value={editImportance}
              onChange={(e) => setEditImportance(parseInt(e.target.value))}
              importance={editImportance}
            />
          </SliderContainer>
          <Button type="submit">Save Changes</Button>
        </EditForm>
      )}

      {habit.archived && (
        <ArchivedNotice>
          This habit is archived. Unarchive to enable tracking.
        </ArchivedNotice>
      )}

      <StyledCalendar
        onChange={toggleHabitCompletion}
        value={date}
        tileClassName={tileClassName}
        tileDisabled={({ date, view }) => habit.archived && view === "month"}
        firstDayOfWeek={0}
        locale={userLocale}
      />

      <ArchiveButton onClick={handleArchiveToggle}>
        {habit.archived ? "Unarchive" : "Archive"} Habit
      </ArchiveButton>
    </CalendarContainer>
  );
}

export default Habit;
