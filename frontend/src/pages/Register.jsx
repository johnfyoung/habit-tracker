import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Alert from '../components/Alert';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LoginLink = styled(Link)`
  margin-top: 1rem;
  text-align: center;
  color: #2196f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 1rem;
`;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, password });
      navigate('/login', { 
        state: { 
          alert: { 
            message: 'Registration successful! Please log in.', 
            type: 'success' 
          } 
        } 
      });
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <FormContainer>
      <PageTitle>Register</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
      </Form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      <LoginLink to="/login">
        Already have an account? Login here
      </LoginLink>
    </FormContainer>
  );
}

export default Register;
