import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HabitItem = styled.div`
  background-color: var(--light-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${(props) => {
      if (props.importance > 0) return "#4caf50";
      if (props.importance < 0) return "#f44336";
      return "var(--light-primary-color)";
    }};
    border-radius: 8px 0 0 8px;
  }

  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;

    &::before {
      background-color: ${(props) => {
        if (props.importance > 0) return "#4caf50";
        if (props.importance < 0) return "#f44336";
        return "var(--dark-primary-color)";
      }};
    }
  }
`;

const HabitInfo = styled.div`
  flex-grow: 1;
`;

const HabitName = styled.h3`
  color: var(--light-primary-color);
  margin: 0 0 0.25rem 0;
  font-size: 1rem;

  @media (prefers-color-scheme: dark) {
    color: var(--dark-primary-color);
  }
`;

const HabitDetails = styled.p`
  color: #757575;
  margin: 0;
  font-size: 0.8rem;

  @media (prefers-color-scheme: dark) {
    color: #9e9e9e;
  }
`;

const Checkbox = styled.input`
  margin-left: 1rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-color: transparent;
`;

const HabitItemContent = styled.div`
  flex-grow: 1;
  cursor: pointer;
`;

const ArchiveButton = styled.button`
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    color: #2196f3;
  }
`;

const HabitTaskContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${(props) => {
      if (props.importance > 0) return "#4caf50";
      if (props.importance < 0) return "#f44336";
      return "transparent";
    }};
    border-radius: 4px 0 0 4px;
  }

  @media (prefers-color-scheme: dark) {
    background: #333;
  }
`;

function HabitTask({
  habit,
  onHabitTracked,
  isCompleted,
  lastCompletedDate,
  isArchived,
  onArchiveToggle,
  selectedDate,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/habit/${habit._id}`);
  };

  return (
    <HabitItem importance={habit.importance}>
      <HabitItemContent onClick={handleClick}>
        <HabitInfo>
          <HabitName>{habit.name}</HabitName>
          <HabitDetails>Frequency: {habit.frequency}</HabitDetails>
          {isCompleted && lastCompletedDate && (
            <HabitDetails>Last completed: {lastCompletedDate}</HabitDetails>
          )}
        </HabitInfo>
      </HabitItemContent>
      {!isArchived && (
        <Checkbox
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onHabitTracked(habit._id);
          }}
        />
      )}
    </HabitItem>
  );
}

export default HabitTask;
