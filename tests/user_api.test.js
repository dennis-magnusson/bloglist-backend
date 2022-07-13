const bcrypt = require('bcrypt')
const User = require('../models/user.js')
const helper = require('./test_helper.js')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretPassword', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a unique username', async () => {
    const usersAtStart = await helper.usersInDatabase()

    const newUser = {
      username: 'dennism',
      name: 'Dennis Magnusson',
      password: 'passywordy',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDatabase()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username isnt unique', async () => {
    const usersAtStart = await helper.usersInDatabase()

    const result = await api
      .post('/api/users')
      .send(helper.newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username taken')

    const usersAtEnd = await helper.usersInDatabase()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDatabase()

    const result = await api
      .post('/api/users')
      .send(helper.invalidUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = 'is shorter than the minimum allowed length (3)'
    expect(result.body.error).toContain(errorMessage)

    const usersAtEnd = await helper.usersInDatabase()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDatabase()

    const result = await api
      .post('/api/users')
      .send(helper.invalidPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const errorMessage = 'password must be at least 3 characters long'
    expect(result.body.error).toContain(errorMessage)

    const usersAtEnd = await helper.usersInDatabase()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})