import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Clock from "./Clock";

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2196f3;
  color: white;
`;

const NavBarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const NavBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  margin-left: 1rem;
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.$show ? "0" : "-100%")};
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
  cursor: pointer;

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
      <NavBarRight>
        <HamburgerButton onClick={toggleMobileMenu}>
          {showMobileMenu ? "✕" : "☰"}
        </HamburgerButton>
        <MobileMenu $show={showMobileMenu}>
          <NavButton to="/habits" onClick={toggleMobileMenu}>
            Habits
          </NavButton>
          <NavButton to="/profile" onClick={toggleMobileMenu}>
            Profile
          </NavButton>
          <NavButton to="/add-habit" onClick={toggleMobileMenu}>
            Add Habit
          </NavButton>
          <NavButton to="/archive" onClick={toggleMobileMenu}>
            Archive
          </NavButton>
          <LogoutButton
            onClick={() => {
              onLogout();
              toggleMobileMenu();
            }}
          >
            Logout
          </LogoutButton>
        </MobileMenu>
      </NavBarRight>
    </NavBarContainer>
  );
}

export default NavBar;
