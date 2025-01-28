import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--light-primary-color);
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: var(--dark-primary-color);
  }

  &:hover {
    text-decoration: underline;
  }
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function Habit({ habits, setHabits, onHabitTracked, showAlert }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImportance, setEditImportance] = useState(0);
  const [allowComments, setAllowComments] = useState(false);
  const userLocale = navigator.language || "en-US"; // Fallback to en-US if browser locale not available

  const habit = habits.find((h) => h._id === id);

  const onArchiveToggle = async () => {
    if (!habit) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/habits/${habit._id}/toggle-archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHabits(habits.map((h) => (h._id === habit._id ? response.data : h)));
      showAlert(
        `${habit.name} ${
          response.data.archived ? "archived" : "unarchived"
        } successfully`,
        "success"
      );

      if (response.data.archived) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
      showAlert("Failed to update habit archive status", "error");
    }
  };

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

  // Initialize edit form when editing starts
  const handleEditClick = () => {
    setEditName(habit.name);
    setEditImportance(habit.importance);
    setAllowComments(habit.allowComments || false);
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
          allowComments: allowComments,
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

  const handleEditChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name === "allowComments") {
      setAllowComments(value);
    } else if (e.target.name === "importance") {
      setEditImportance(parseInt(value));
    } else {
      setEditName(value);
    }
  };

  return (
    <CalendarContainer>
      <BackButton to="/">
        <span>←</span> Back to Habits
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
            onChange={handleEditChange}
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
              onChange={handleEditChange}
              importance={editImportance}
            />
          </SliderContainer>
          <CheckboxGroup>
            <Input
              type="checkbox"
              id="allowComments"
              name="allowComments"
              checked={allowComments}
              onChange={handleEditChange}
            />
            <label htmlFor="allowComments">Allow comments when completing habit</label>
          </CheckboxGroup>
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

      <ArchiveButton onClick={onArchiveToggle}>
        {habit.archived ? "Unarchive" : "Archive"} Habit
      </ArchiveButton>
    </CalendarContainer>
  );
}

export default Habit;
