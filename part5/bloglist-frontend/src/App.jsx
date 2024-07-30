import React, { useState, useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll();
      if (initialBlogs.length === 0) {
        const dummyBlogs = [
          {
            id: '1',
            title: 'Understanding React',
            author: 'Jane Doe',
            url: 'http://example.com/react',
            likes: 5,
            user: { username: 'janedoe' }
          },
          {
            id: '2',
            title: 'Learning JavaScript',
            author: 'John Smith',
            url: 'http://example.com/javascript',
            likes: 3,
            user: { username: 'johnsmith' }
          },
          {
            id: '3',
            title: 'CSS for Beginners',
            author: 'Alice Johnson',
            url: 'http://example.com/css',
            likes: 2,
            user: { username: 'alicejohnson' }
          },
        ];
        setBlogs(dummyBlogs);
      } else {
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      }
    };
    fetchBlogs();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setMessage({ type: 'success', text: `Welcome ${user.name}` });
      setTimeout(() => setMessage(null), 5000);
    } catch (exception) {
      setMessage({ type: 'error', text: 'Wrong username or password' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      const updatedBlogs = blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes);
      setBlogs(updatedBlogs);
      blogFormRef.current.toggleVisibility();
      setMessage({ type: 'success', text: `Added blog: ${returnedBlog.title}` });
      setTimeout(() => setMessage(null), 5000);
    } catch (exception) {
      console.error(exception);
      setMessage({ type: 'error', text: 'Error adding blog' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      const updatedBlogs = blogs.map(b => b.id === blog.id ? returnedBlog : b).sort((a, b) => b.likes - a.likes);
      setBlogs(updatedBlogs);
    } catch (exception) {
      console.error(exception);
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter(b => b.id !== blog.id));
        setMessage({ type: 'success', text: `Deleted blog: ${blog.title}` });
        setTimeout(() => setMessage(null), 5000);
      } catch (exception) {
        console.error(exception);
        setMessage({ type: 'error', text: 'Error deleting blog' });
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={message} />
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <BlogList blogs={blogs} handleLike={handleLike} handleDelete={handleDelete} user={user} />
    </div>
  );
};

export default App;
