const dummy = (blogs) => {
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
  // find the author with most blogs and the amount
  return blogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

