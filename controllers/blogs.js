const blogsRouter = require('express').Router()
const { request } = require('http')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const user = await User.findOne()

  const blogWithUser = {
    title: request.body.title,
    likes: request.body.likes,
    url: request.body.url,
    user: user._id
  }

  const blog = new Blog(blogWithUser)

  // Validations
  if (!blog.likes) { blog.likes = 0 }
  if (!blog.title) { return response.status(400).json({ error: 'Missing Title' }) }
  if (!blog.url) { return response.status(400).json({ error: 'Missing URL' }) }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
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