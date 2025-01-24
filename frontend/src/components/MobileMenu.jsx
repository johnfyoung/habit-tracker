import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9998;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 250px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const MenuItem = styled(Link)`
  color: #2196f3;
  text-decoration: none;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const LogoutButton = styled.button`
  border: none;
  background-color: #2196f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: auto;

  &:hover {
    background-color: #1976d2;
  }
`;

function MobileMenu({ isOpen, onItemClick, onLogout }) {
  return (
    <>
      <MenuOverlay isOpen={isOpen} onClick={onItemClick} />
      <MenuContainer isOpen={isOpen}>
        <MenuItem to="/" onClick={onItemClick}>
          Habits
        </MenuItem>
        <MenuItem to="/add" onClick={onItemClick}>
          Add Habit
        </MenuItem>
        <MenuItem to="/archive" onClick={onItemClick}>
          Archive
        </MenuItem>
        <MenuItem to="/profile" onClick={onItemClick}>
          Profile
        </MenuItem>
        <LogoutButton
          onClick={() => {
            onLogout();
            onItemClick();
          }}
        >
          Logout
        </LogoutButton>
      </MenuContainer>
    </>
  );
}

export default MobileMenu;
