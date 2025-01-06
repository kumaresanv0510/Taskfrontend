import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

   
    if (!email || !validateEmail(email)) {
      formErrors.email = 'Please enter a valid email address.';
    }


    if (!password) {
      formErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long.';
    }

   
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }


    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        onLogin(); 
        navigate('/dashboard'); 
      } else {
       
        setErrors({ global: data.message || 'Invalid email or password.' });
      }
    } catch (error) {
      
      setErrors({ global: 'An error occurred. Please try again.' });
    }
  };

  
  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === 'email') {
      setEmail(value);
      if (errors.email) {
        setErrors((prevErrors) => ({ ...prevErrors, email: null })); 
      }
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password) {
        setErrors((prevErrors) => ({ ...prevErrors, password: null })); 
      }
    }
    
   
    if (errors.global) {
      setErrors((prevErrors) => ({ ...prevErrors, global: null }));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => handleChange(e, 'email')} 
            className="form-control" 
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => handleChange(e, 'password')} 
            className="form-control" 
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {errors.global && <div className="error">{errors.global}</div>}

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
