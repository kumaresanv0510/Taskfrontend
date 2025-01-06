import React, { useState } from 'react';
import './Createpost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreatePost = (e) => {
    e.preventDefault();

   
    if (title.length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }
    if (content.length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }

    const newPost = { title, author, content };

    console.log('New Post Data:', newPost);  

    axios.post('http://localhost:5000/api/blogs', newPost, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,  
      }
    })
      .then((response) => {
        console.log('Post Created:', response.data);  
        navigate('/blog-list');  
      })
      .catch((err) => {
        console.log('Error:', err.response?.data || err);  
        setError(err.response?.data?.message || 'An error occurred');
      });
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Title (at least 5 characters)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          placeholder="Content (at least 10 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Create Post</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreatePost;
