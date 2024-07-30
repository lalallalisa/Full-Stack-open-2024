import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('calls onSubmit with correct details when a new blog is created', () => {
    const createBlog = jest.fn();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');
    const submitButton = screen.getByText('create');

    fireEvent.change(titleInput, { target: { value: 'New Blog Title' } });
    fireEvent.change(authorInput, { target: { value: 'New Blog Author' } });
    fireEvent.change(urlInput, { target: { value: 'http://example.com/newblog' } });
    fireEvent.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'http://example.com/newblog',
    });
  });
});
