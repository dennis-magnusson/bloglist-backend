const _ = require('lodash')

const dummy = (blogs) =>  {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  const result = blogs.reduce(reducer, 0)
  return result
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) { return }
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = (blogs) => {
  const authorsObj = _.countBy(blogs, (blog) => blog.author)
  const authorsArray = Object.keys(authorsObj).map(author => ({ author, blogs: authorsObj[author] }))
  const authorWithMostBlogs = _.maxBy(authorsArray, (author) => author.blogs)
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  const reducer = (result, blog) => {
    result[blog.author] = result[blog.author]
      ? result[blog.author] + blog.likes
      : blog.likes
    return result
  }
  const authorsArr = blogs.reduce(reducer, [])
  const authors = Object.keys(authorsArr).map(author => ({ author, likes: authorsArr[author]}))
  return _.maxBy(authors, author => author.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

