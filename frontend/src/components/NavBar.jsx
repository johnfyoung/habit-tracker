import React, { useState } from 'react';
import styled from 'styled-components';
import MobileMenu from './MobileMenu';

const NavBarContainer = styled.nav`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0)'};
`;

function NavBar({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <NavBarContainer>
      <MenuButton onClick={toggleMenu} isOpen={isMenuOpen}>
        {isMenuOpen ? '✕' : '☰'}
      </MenuButton>
      <MobileMenu isOpen={isMenuOpen} onLogout={onLogout} onItemClick={handleMenuItemClick} />
    </NavBarContainer>
  );
}

export default NavBar;