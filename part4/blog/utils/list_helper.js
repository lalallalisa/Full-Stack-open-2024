const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  });
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author]);

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  };
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] || 0;
    acc[blog.author] += blog.likes;
    return acc;
  }, {});

  const topAuthor = _.maxBy(_.keys(authorLikes), (author) => authorLikes[author]);

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
