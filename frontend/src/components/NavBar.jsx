import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Clock from "./Clock";

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: white;
  background-color: ${props => props.$standalone ? '#2196f3' : 'transparent'};
  padding: ${props => props.$standalone ? '1rem' : '0'};
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

function NavBar({ isAuthenticated, onLogout, isMobile, $standalone }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <NavBarContainer $standalone={$standalone}>
      <NavBarRight>
        {isAuthenticated ? (
          <>
            {!isMobile && <Clock />}
            <NavButton as="button" onClick={onLogout}>
              Logout
            </NavButton>
          </>
        ) : (
          <>
            <NavButton to="/login">Login</NavButton>
            <NavButton to="/register">Register</NavButton>
          </>
        )}
      </NavBarRight>
    </NavBarContainer>
  );
}

export default NavBar;
