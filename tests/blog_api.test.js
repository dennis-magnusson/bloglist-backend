const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.js')
const Blog = require('../models/blog.js')
const User = require('../models/user')

let token = ''


describe('Initially saved blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create user in db
    const user = await api
      .post('/api/users')
      .send(helper.newUser)

    // Get token
    const login = await api.post('/api/login').send(helper.newUser)
    token = login.body.token

    // save initial blogs in db
    let blogObject = new Blog(helper.initialBlogs[0])
    blogObject.user = user.body.id
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    blogObject.user = user.body.id
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const result = await api.get('/api/blogs')
    expect(result.body).toHaveLength(2)
  })

  test('the first blog is about React Patterns', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })
})

describe('getting specific blogs', () => {
  test('id is defined', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id
    expect(id).toBeDefined()
  })

  test('a blog that is valid can be added', async () => {

    await api
      .post('/api/blogs')
      .send(helper.testBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(helper.testBlog.title)
  })

  test('likes are 0 for a blog that was created without likes', async () => {

    await api
      .post('/api/blogs')
      .send(helper.blogWithoutLikes)

    const response = await api.get('/api/blogs')
    const likes = response.body[response.body.length - 1].likes
    expect(likes).toBe(0)
  })

  test('a blog that is invalid cant be added', async () => {

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.invalidBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

  })

  test('a blog cannot be added without token', async () => {

    await api
      .post('/api/blogs')
      .send(helper.invalidBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

  })
  
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDatabase()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDatabase()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('editing a blog', () => {
  test('succeeds with code 204 if parameters are valid', async () => {
    const blogsAtStart = await helper.blogsInDatabase()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 100
    blogToUpdate.title = 'Updated Title'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDatabase()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain(blogToUpdate.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})


