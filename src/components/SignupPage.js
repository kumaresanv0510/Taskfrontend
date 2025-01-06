import React, { useState } from 'react';
import './SignupPage.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);  
  const [passwordStrength, setPasswordStrength] = useState('');  
  const [signupSuccess, setSignupSuccess] = useState(false); 
  const navigate = useNavigate();

 
  const checkPasswordStrength = (password) => {
    const strength = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password) 
      ? 'Strong' 
      : /(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}/.test(password) 
      ? 'Moderate' 
      : 'Weak';
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Name is required.';
    if (!email || !/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Please enter a valid email.';
    if (!password || password.length < 6) formErrors.password = 'Password must be at least 6 characters.';
    if (passwordStrength === 'Weak') formErrors.passwordStrength = 'Password is too weak.';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = { name, email, password };
    setIsLoading(true);  

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      const { token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);  
        setName(''); 
        setEmail('');
        setPassword('');
        setSignupSuccess(true);  
        navigate('/dashboard');  
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data.errors) {
          const errorMessages = err.response.data.errors.reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
          }, {});
          setErrors(errorMessages);
        } else if (err.response.data.message) {
          setErrors({ global: err.response.data.message });
        }
      } else {
        setErrors({ global: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);  
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {signupSuccess && <div className="success-message">Signup successful! Redirecting...</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="form-control" 
            required 
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-control" 
            required 
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-container">
            <input 
              type={passwordVisible ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); checkPasswordStrength(e.target.value); }} 
              className="form-control" 
              required 
            />
            <button 
              type="button" 
              className="show-hide-btn" 
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordStrength && <div className="password-strength">{passwordStrength}</div>}
          {errors.password && <span className="error">{errors.password}</span>}
          {errors.passwordStrength && <span className="error">{errors.passwordStrength}</span>}
        </div>

        {errors.global && <div className="error">{errors.global}</div>}

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
