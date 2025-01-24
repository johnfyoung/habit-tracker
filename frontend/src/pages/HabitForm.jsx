import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #2196f3;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1976d2;
  }
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

function HabitForm({ addHabit }) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [importance, setImportance] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(`submitting: ${e}`);
    e.preventDefault();
    console.log(
      `name: ${name}, frequency: ${frequency}, importance: ${importance}`
    );
    await addHabit({ name, frequency, importance });
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Select>
      <SliderContainer>
        <SliderLabel importance={importance}>
          Habit Importance <span>{importance}</span>
        </SliderLabel>
        <Slider
          type="range"
          min="-10"
          max="10"
          value={importance}
          onChange={(e) => setImportance(parseInt(e.target.value))}
        />
      </SliderContainer>
      <Button type="submit">Add Habit</Button>
    </Form>
  );
}

export default HabitForm;
