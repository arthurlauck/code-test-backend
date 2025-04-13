# ProjectMark backend assessment

## Overview

Build a RESTful API for a Dynamic Knowledge Base System. This system should manage interconnected topics and resources with version control, user roles, and permissions. The challenge will assess the candidate’s ability to implement complex business logic, use advanced OOP concepts, design patterns, and algorithms, as well as maintain high code quality and testing standards.

## Setup

1. Clone the repository
2. Install dependencies:
    - SQLlite is being used, this requires node@22 and is set to use in memory state

```sh
npm install
```

3. Build the project:

```sh
npm run build
```

4. Run the development server:

```sh
npm run dev
```

## Authentication

The application uses a mocked authentication system for development purposes. To authenticate requests, include a `fake_auth` header with one of the following values:

- `admin`: Full access to all endpoints
- `editor`: Can create, read, update and delete content
- `viewer`: Can only read content (default if no header is provided)

Example:

```
fake_auth: admin
```

## API Routes

The Postman collection for testing API endpoints can be found within the project directory

### Topics

| Method | Route                         | Description                                | Required Role        |
| ------ | ----------------------------- | ------------------------------------------ | -------------------- |
| GET    | `/topic/:id`                  | Get a topic by ID                          | READ (all roles)     |
| GET    | `/topic/:id/version/:version` | Get a specific version of a topic          | READ (all roles)     |
| GET    | `/topic/:id/tree`             | Get topic tree starting from a specific ID | READ (all roles)     |
| GET    | `/topic/path/:fromId/:toId`   | Get path between two topics                | READ (all roles)     |
| POST   | `/topic`                      | Create a new topic                         | WRITE (admin/editor) |
| PUT    | `/topic/:id`                  | Update a topic                             | WRITE (admin/editor) |
| DELETE | `/topic/:id`                  | Delete a topic                             | WRITE (admin/editor) |

### Resources

| Method | Route           | Description           | Required Role        |
| ------ | --------------- | --------------------- | -------------------- |
| GET    | `/resource/:id` | Get a resource by ID  | READ (all roles)     |
| POST   | `/resource`     | Create a new resource | WRITE (admin/editor) |
| PUT    | `/resource/:id` | Update a resource     | WRITE (admin/editor) |
| DELETE | `/resource/:id` | Delete a resource     | WRITE (admin/editor) |

## Running Tests

The project includes both unit tests and integration tests. Run them with:

```sh
npm test
```

## Development

Start the development server with hot-reloading:

```sh
npm run dev
```

Code formatting and linting:

```sh
npm run lint
npm run lint:fix
npm run pretty
```