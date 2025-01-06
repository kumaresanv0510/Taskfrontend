import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BlogList from './components/BlogList';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import EditPost from './components/EditPost';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', 'your-jwt-token'); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken'); 
  };

  const triggerRefresh = () => {
    setRefresh(prev => !prev); 
  };

  return (
    <Router>
      <div className="App">
        <h1>Blog Application</h1>

       
        {isAuthenticated ? (
          <nav>
            <Link to="/dashboard">Dashboard</Link> | 
            <Link to="/create-post">Create Post</Link> | 
            <Link to="/blog-list">Blog List</Link> | 
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </nav>
        ) : (
          <nav>
            <Link to="/login">Login</Link> | 
            <Link to="/signup">Signup</Link>
          </nav>
        )}

        
        <Routes>
          
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />

          
          <Route path="/dashboard" element={isAuthenticated ? <h2>Welcome to Dashboard</h2> : <Navigate to="/login" />} />
          <Route path="/create-post" element={isAuthenticated ? <CreatePost triggerRefresh={triggerRefresh} /> : <Navigate to="/login" />} />
          <Route path="/blog-list" element={isAuthenticated ? <BlogList key={refresh} /> : <Navigate to="/login" />} />
          
          
          <Route path="/post/:id" element={<PostDetail />} />

      
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
