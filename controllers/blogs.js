const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!request.user) {
    const errorMsg = !request.token
      ? 'missing token'
      : 'invalid token'
    return response.status(401).json({ error: errorMsg })
  }

  const blogWithUser = {
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes,
    url: request.body.url,
    user: request.user._id
  }

  const blog = new Blog(blogWithUser)

  // Validations
  if (!blog.likes) { blog.likes = 0 }
  if (!blog.title) { return response.status(400).json({ error: 'Missing Title' }) }
  if (!blog.url) { return response.status(400).json({ error: 'Missing URL' }) }

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'invalid id' })
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'user does not have permimssion' })
  }

  await Blog.findByIdAndDelete(blog.id)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  const blog = {
    title: request.body.title,
    likes: request.body.likes,
    url: request.body.url
  }

  if (!blog.title || !blog.likes || !blog.url) {
    return response.status(400).json({ error: 'Invalid or missing parameters' })
  }

  const id = request.params.id
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })

  response.json(updatedBlog)
})

module.exports = blogsRouter