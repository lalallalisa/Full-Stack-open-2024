import users from '../users';

const login = async credentials => {
  const user = users.find(
    user => user.username === credentials.username && user.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  return {
    username: user.username,
    name: user.name,
    token: 'fake-jwt-token' 
  };
};

export default { login };
