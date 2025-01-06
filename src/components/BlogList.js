import React, { useState, useEffect } from 'react';
import './BlogList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/blogs')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const deletePost = (id) => {
  
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
  
      axios.delete(`http://localhost:5000/api/blogs/${id}`)
        .then(() => {
          
          setPosts(posts.filter(post => post._id !== id));
        })
        .catch(error => {
          console.error('Error deleting post:', error);
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const filteredPosts = posts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Blog List</h2>

 
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, or content..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <ul>
        {filteredPosts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p><strong>Author:</strong> {post.author}</p>
            <p>{post.content}</p> 
            <Link to={`/edit/${post._id}`}>
              <button className="edit-btn">Edit</button>
            </Link>
            <button className="delete-btn" onClick={() => deletePost(post._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
