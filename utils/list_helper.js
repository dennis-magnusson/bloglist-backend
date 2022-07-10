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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

