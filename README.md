# Bloglist backend API

This is the backend API for a Bloglist CRUD application. It is built with Node.js and Express, and uses MongoDB for data storage.

## Features

- User authentication and authorization
- CRUD operations for blog posts
- Automated testing for API endpoints

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone git@github.com:dennis-magnusson/bloglist-backend.git
```

2. Navigate to the project directory:

```bash
cd bloglist-backend
```

3. Install dependencies:

```bash
npm install
```

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

- MONGODB_URI: Your MongoDB connection string
- TEST_MONGODB_URI: Your MongoDB connection string used when tests are run
- SECRET: A secret string for JWT token generation
- PORT: The port you wish the application to serve

### Running the application

To start the server, run:

```bash
npm start
```

### Testing

To run the tests, use:

```bash
npm test
```

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
