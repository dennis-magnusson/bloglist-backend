const Blog = require('../models/blog.js')

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
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }
]

const blogWithoutLikes = {
    title: 'Test Blog',
    author: 'Test Name',
    url: 'https://www.test.com'
}

const testBlog = {
    title: 'Test Blog',
    author: 'Test Name',
    url: 'https://www.test.com',
    likes: 0
}

const invalidBlog = {
    likes: 3
}

const blogsInDatabase = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

module.exports = {
    initialBlogs,
    blogWithoutLikes,
    testBlog,
    invalidBlog,
    blogsInDatabase
}