import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

function HabitForm({ addHabit }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHabit({ name, frequency });
    setName('');
    setFrequency('daily');
    navigate('/habits');
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
      <Select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </Select>
      <Button type="submit">Add Habit</Button>
    </Form>
  );
}

export default HabitForm;
