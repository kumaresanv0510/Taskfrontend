import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState({ title: '', content: '', author: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post data.');
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    
    axios.put(`http://localhost:5000/api/blogs/${id}`, post, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`, 
      },
    })
    .then(response => {
      console.log('Post updated:', response.data);
      navigate('/blog-list'); 
    })
    .catch(error => {
      console.error('Error updating post:', error);
      setError('Failed to update post.');
    });
  };

  return (
    <div>
      <h2>Edit Post</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={post.author}
            onChange={(e) => setPost({ ...post, author: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;
