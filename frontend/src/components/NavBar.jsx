import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Clock from "./Clock";
import MobileMenu from "./MobileMenu";

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: white;
  background-color: ${(props) =>
    props.$standalone ? "#2196f3" : "transparent"};
  padding: ${(props) => (props.$standalone ? "1rem" : "0")};
`;

const NavBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const NavButton = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 1rem;
`;

function NavBar({ isAuthenticated, onLogout, isMobile, $standalone }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavBarContainer $standalone={$standalone}>
      <NavBarRight>
        {isAuthenticated ? (
          <>
            {!isMobile && <Clock />}
            {!isMobile && (
              <HamburgerButton onClick={toggleMenu}>☰</HamburgerButton>
            )}
            <MobileMenu
              isOpen={showMenu}
              onItemClick={() => setShowMenu(false)}
              onLogout={onLogout}
            />
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
