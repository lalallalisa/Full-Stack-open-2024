const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

let token;
let nonCreatorToken;
let blogId;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);
  const user = new User({ username: 'testuser', passwordHash });
  const nonCreator = new User({ username: 'noncreator', passwordHash });

  await user.save();
  await nonCreator.save();

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' });

  token = response.body.token;

  const nonCreatorResponse = await api
    .post('/api/login')
    .send({ username: 'noncreator', password: 'password123' });

  nonCreatorToken = nonCreatorResponse.body.token;

  const newBlog = {
    title: 'Async/Await in Node.js',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 10
  };

  const blogResponse = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`);

  blogId = blogResponse.body.id;
});

test('a valid blog can be added with a token', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Jane Doe',
    url: 'http://example.com/new-blog-post',
    likes: 5
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const contents = response.body.map(r => r.title);

  expect(response.body).toHaveLength(2);  // Two blogs: one created in beforeEach and one created in this test
  expect(contents).toContain('New Blog Post');
});

test('a blog cannot be added without a token', async () => {
  const newBlog = {
    title: 'Async/Await in Node.js',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 10
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(1);
});

test('a blog can be deleted by the creator', async () => {
  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(0);
});

test('a blog cannot be deleted by a non-creator', async () => {
  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${nonCreatorToken}`)
    .expect(403);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(1);
});

test('a blog cannot be deleted without a token', async () => {
  await api
    .delete(`/api/blogs/${blogId}`)
    .expect(401);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(1);
});

afterAll(() => {
  mongoose.connection.close();
});
