import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const AlertContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.type === "success" ? "#4caf50" : "#f44336"};
  color: white;
  animation: ${fadeIn} 0.5s ease-out, ${fadeOut} 0.5s ease-in 4.5s;
  width: 100%;
`;

function Alert({ message, type }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, type]);

  return <AlertContainer type={type}>{message}</AlertContainer>;
}

export default Alert;
