import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background: var(--dark-input-bg-color);
    color: var(--dark-text-color);
    border-color: var(--dark-border-color);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  @media (prefers-color-scheme: dark) {
    background: var(--dark-input-bg-color);
    color: var(--dark-text-color);
    border-color: var(--dark-border-color);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: var(--light-primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--light-primary-color-dark);
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--dark-primary-color);
    
    &:hover {
      background-color: var(--dark-primary-color-dark);
    }
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
      props.$importance > 0
        ? "#4caf50"
        : props.$importance < 0
        ? "#f44336"
        : "#757575"};
        
    @media (prefers-color-scheme: dark) {
      color: ${(props) =>
        props.$importance > 0
          ? "#66bb6a"
          : props.$importance < 0
          ? "#ef5350"
          : "#9e9e9e"};
    }
  }
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
  margin: 0.5rem 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) =>
      props.$importance > 0
        ? "#4caf50"
        : props.$importance < 0
        ? "#f44336"
        : "#757575"};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${(props) =>
      props.$importance > 0
        ? "#4caf50"
        : props.$importance < 0
        ? "#f44336"
        : "#757575"};
    cursor: pointer;
    border: none;
  }
  
  @media (prefers-color-scheme: dark) {
    background: #404040;
    
    &::-webkit-slider-thumb {
      background: ${(props) =>
        props.$importance > 0
          ? "#66bb6a"
          : props.$importance < 0
          ? "#ef5350"
          : "#9e9e9e"};
    }

    &::-moz-range-thumb {
      background: ${(props) =>
        props.$importance > 0
          ? "#66bb6a"
          : props.$importance < 0
          ? "#ef5350"
          : "#9e9e9e"};
    }
  }
`;

function HabitForm({ addHabit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
    importance: 0,
    allowComments: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHabit(formData);
    navigate("/");
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Habit Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <SliderContainer>
            <SliderLabel $importance={formData.importance}>
              Importance <span>{formData.importance}</span>
            </SliderLabel>
            <Slider
              type="range"
              min="-10"
              max="10"
              step="1"
              name="importance"
              value={formData.importance}
              onChange={handleChange}
              $importance={formData.importance}
            />
          </SliderContainer>
        </FormGroup>

        <FormGroup>
          <CheckboxGroup>
            <Input
              type="checkbox"
              id="allowComments"
              name="allowComments"
              checked={formData.allowComments}
              onChange={handleChange}
            />
            <Label htmlFor="allowComments">Allow comments when completing habit</Label>
          </CheckboxGroup>
        </FormGroup>

        <Button type="submit">Create Habit</Button>
      </Form>
    </FormContainer>
  );
}

export default HabitForm;
