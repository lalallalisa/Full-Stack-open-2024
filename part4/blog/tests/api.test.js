const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs');
  const ids = response.body.map(r => r.id);
  ids.forEach(id => expect(id).toBeDefined());
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Async/Await in Node.js',
    author: 'John Doe',
    url: 'http://example.com/async-await',
    likes: 10
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const contents = response.body.map(r => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain('Async/Await in Node.js');
});

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'No Likes Property',
    author: 'Jane Doe',
    url: 'http://example.com/no-likes'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'No Title or URL'
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('a blog can be deleted', async () => {
  const responseAtStart = await api.get('/api/blogs');
  const blogToDelete = responseAtStart.body[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const responseAtEnd = await api.get('/api/blogs');
  expect(responseAtEnd.body).toHaveLength(initialBlogs.length - 1);

  const contents = responseAtEnd.body.map(r => r.title);
  expect(contents).not.toContain(blogToDelete.title);
});

test('a blog can be updated', async () => {
  const responseAtStart = await api.get('/api/blogs');
  const blogToUpdate = responseAtStart.body[0];

  const updatedBlog = {
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const responseAtEnd = await api.get('/api/blogs');
  const updatedBlogFromDB = responseAtEnd.body.find(r => r.id === blogToUpdate.id);

  expect(updatedBlogFromDB.likes).toBe(blogToUpdate.likes + 1);
});

afterAll(() => {
  mongoose.connection.close();
});
