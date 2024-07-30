const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

test('creating a new user with valid data', async () => {
  const newUser = {
    username: 'johndoe',
    name: 'John Doe',
    password: 'password123'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await api.get('/api/users');
  expect(usersAtEnd.body).toHaveLength(1);
});

test('creating a new user with invalid data (short username)', async () => {
  const newUser = {
    username: 'jd',
    name: 'John Doe',
    password: 'password123'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test('creating a new user with invalid data (short password)', async () => {
  const newUser = {
    username: 'johndoe',
    name: 'John Doe',
    password: 'pw'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test('creating a new user with duplicate username', async () => {
  const newUser = {
    username: 'johndoe',
    name: 'John Doe',
    password: 'password123'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const duplicateUser = {
    username: 'johndoe',
    name: 'Jane Doe',
    password: 'password456'
  };

  await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
