const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const logger = require('./logger.js')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id format' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  request.token = (auth && auth.toLowerCase().startsWith('bearer ')) 
    ? auth.substring(7)
    : null
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken.id
      ? await User.findById(decodedToken.id)
      : null
  }
  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}