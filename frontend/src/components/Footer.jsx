import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  CheckBadgeIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 0.75rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (prefers-color-scheme: dark) {
    background: var(--dark-bg-color);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
`;

const NavLink = styled(Link)`
  color: var(--light-text-color);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: var(--light-hover-color);
  }

  &.active {
    color: var(--light-primary-color);
  }

  @media (prefers-color-scheme: dark) {
    color: var(--dark-text-color);

    &:hover {
      background: var(--dark-hover-color);
    }

    &.active {
      color: var(--dark-primary-color);
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  color: var(--light-text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: var(--light-hover-color);
  }

  @media (prefers-color-scheme: dark) {
    color: var(--dark-text-color);

    &:hover {
      background: var(--dark-hover-color);
    }
  }
`;

function Footer({ onLogout }) {
  return (
    <FooterContainer>
      <Nav>
        <NavLink to="/" $end>
          <CheckBadgeIcon />
          <span>Habits</span>
        </NavLink>
        <NavLink to="/add">
          <PlusCircleIcon />
          <span>Add</span>
        </NavLink>
        <NavLink to="/archive">
          <ArchiveBoxIcon />
          <span>Archive</span>
        </NavLink>
        <LogoutButton onClick={onLogout}>
          <PowerIcon />
          <span>Logout</span>
        </LogoutButton>
      </Nav>
    </FooterContainer>
  );
}

export default Footer;
