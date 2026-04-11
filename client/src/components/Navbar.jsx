import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

// FIX: Added mobile-responsive collapse for navigation links

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the navigation bar completely on the login screen
  if (location.pathname === '/login' || location.pathname === '/') {
    return null; 
  }

  const handleLogout = () => {
    // Clear the saved credentials
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_role');
    
    // send user back to the login screen
    navigate('/login');
  };

  return (
    <Navbar variant="dark" className="border-bottom border-info mb-4" style={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
      <Container>
        <Navbar.Brand className="text-info" style={{ fontWeight: 'bold', letterSpacing: '2px' }}>
          NEXUS ARENA
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-danger" onClick={handleLogout}>
            Disconnect (Log Out)
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;