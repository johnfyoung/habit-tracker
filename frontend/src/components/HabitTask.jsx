import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HabitItem = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HabitInfo = styled.div`
  flex-grow: 1;
`;

const HabitName = styled.h3`
  color: #2196f3;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
`;

const HabitDetails = styled.p`
  color: #757575;
  margin: 0;
  font-size: 0.8rem;
`;

const Checkbox = styled.input`
  margin-left: 1rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
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

function HabitTask({ habit, onHabitTracked, isCompleted, lastCompletedDate, isArchived }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/habit/${habit._id}`);
  };

  return (
    <HabitItem>
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
