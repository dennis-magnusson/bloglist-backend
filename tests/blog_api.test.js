const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper.js')
const Blog = require('../models/blog.js')
const blog = require('../models/blog.js')
const exp = require('constants')

describe('Tests', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        let blogObject = new Blog(helper.initialBlogs[0])
        await blogObject.save()
        blogObject = new Blog(helper.initialBlogs[1])
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

    test('id is defined', async () => {
        const response = await api.get('/api/blogs')
        const id = response.body[0].id
        expect(id).toBeDefined()
    })

    test('a blog that is valid can be added', async () => {

        await api
          .post('/api/blogs')
          .send(helper.testBlog)
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
    
})

afterAll(() => {
    mongoose.connection.close()
  })


