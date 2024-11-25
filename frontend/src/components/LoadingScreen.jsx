import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 1000;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2196f3;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.h2`
  color: #2196f3;
  margin-top: 20px;
  font-size: 1.5rem;
`;

const LoadingSubText = styled.p`
  color: #666;
  margin-top: 10px;
  font-size: 1rem;
`;

function LoadingScreen() {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>Loading...</LoadingText>
      <LoadingSubText>Please wait while we fetch your habits</LoadingSubText>
    </LoadingContainer>
  );
}

export default LoadingScreen;
