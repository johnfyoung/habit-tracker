import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.show ? '0' : '-100%'};
  width: 100%;
  height: 100vh;
  background-color: #2196f3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: right 0.3s ease-in-out;
  z-index: 1000;
`;

const NavButton = styled(Link)`
  background: none;
  border: none;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  text-decoration: none;
  text-align: center;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

function NavBar({ onLogout }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <NavBarContainer>
      <HamburgerButton onClick={toggleMobileMenu}>
        {showMobileMenu ? '✕' : '☰'}
      </HamburgerButton>
      <MobileMenu show={showMobileMenu}>
        <NavButton to="/habits" onClick={toggleMobileMenu}>Habits</NavButton>
        <NavButton to="/add-habit" onClick={toggleMobileMenu}>Add Habit</NavButton>
        <NavButton to="/archive" onClick={toggleMobileMenu}>Archive</NavButton>
        <LogoutButton onClick={() => { onLogout(); toggleMobileMenu(); }}>Logout</LogoutButton>
      </MobileMenu>
    </NavBarContainer>
  );
}

export default NavBar;