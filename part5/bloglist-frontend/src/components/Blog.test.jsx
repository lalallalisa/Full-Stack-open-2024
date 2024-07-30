import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import Blog from './Blog';

const blog = {
  title: 'The Blog Title',
  author: 'The Blog Author',
  url: 'http://example.com/blog',
  likes: 5,
  user: {
    username: 'testuser',
  },
};

const user = {
  username: 'testuser',
};

describe('<Blog />', () => {
  let mockHandlerLike;
  let mockHandlerDelete;

  beforeEach(() => {
    mockHandlerLike = jest.fn();
    mockHandlerDelete = jest.fn();
  });

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} user={user} handleLike={mockHandlerLike} handleDelete={mockHandlerDelete} />);
    
    expect(screen.getByText('The Blog Title')).toBeDefined();
    expect(screen.getByText('The Blog Author')).toBeDefined();
    expect(screen.queryByText('http://example.com/blog')).toBeNull();
    expect(screen.queryByText('5 likes')).toBeNull();
  });

  test('renders url and likes when the view button is clicked', () => {
    render(<Blog blog={blog} user={user} handleLike={mockHandlerLike} handleDelete={mockHandlerDelete} />);
    
    const button = screen.getByText('view');
    fireEvent.click(button);

    expect(screen.getByText('http://example.com/blog')).toBeDefined();
    expect(screen.getByText('5 likes')).toBeDefined();
  });

  test('calls event handler twice if like button is clicked twice', () => {
    render(<Blog blog={blog} user={user} handleLike={mockHandlerLike} handleDelete={mockHandlerDelete} />);
    
    const button = screen.getByText('view');
    fireEvent.click(button);

    const likeButton = screen.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandlerLike.mock.calls).toHaveLength(2);
  });
});
