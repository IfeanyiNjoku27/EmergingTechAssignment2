import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/mutations';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // hooks 
  const [loginUser] = useMutation(LOGIN_MUTATION);
  const [registerUser] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Execute Login
        const { data } = await loginUser({ 
          variables: { email: formData.email, password: formData.password } 
        });
        
        // Save token and role
        localStorage.setItem('nexus_token', data.login.token);
        localStorage.setItem('nexus_role', data.login.user.role);

        // Route based on role
        if (data.login.user.role === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/player-dashboard');
        }
      } else {
        // Execute Registration (Force the 'Player' role for public signups)
        await registerUser({ 
          variables: { ...formData, role: 'Player' } 
        });
        alert('Registration successful! Please log in.');
        setIsLogin(true); // Flip back to login view
      }
    } catch (err) {
      console.error(err);
      alert(isLogin ? 'Login failed. Check credentials.' : 'Registration failed.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="bg-dark text-light border-info p-4" style={{ width: '400px', zIndex: 10 }}>
        <h3 className="text-center text-info mb-4">
          {isLogin ? 'NEXUS LOGIN' : 'PLAYER REGISTRATION'}
        </h3>
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Control type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </Form.Group>
          <Button variant="outline-info" type="submit" className="w-100 mb-3">
            {isLogin ? 'ENTER ARENA' : 'REGISTER'}
          </Button>
          <div className="text-center">
            <Button variant="link" className="text-info text-decoration-none" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;