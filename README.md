# Country Calendar API

A NestJS-based API that provides country information and allows users to add national holidays to their calendar, integrated with MongoDB for persistence and Docker for deployment.

## Tech Stack

- **Backend**: NestJS, Node.js, TypeScript
- **Database**: MongoDB (via Mongoose)
- **HTTP Client**: Axios (via `@nestjs/axios`)
- **Containerization**: Docker
- **External APIs**: Date Nager API, Countries Now API

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- MongoDB (optional, if not using Docker)

## Installation

### Without Docker

1.  Clone the repository:

    ```bash
    git clone https://github.com/matshp0/developsToday-test
    cd https://github.com/matshp0/developsToday-test

    ```

2.  Install dependencies:

    ```bash
    npm install

    ```

3.  Set up environment variables: Create a `.env` file in the root directory and add:

    ```
    DATABASE_URL=mongodb://mongo:secret@localhost:27017/mydb

    ```

4.  Run the application:

    ```bash
    npm run start:dev

    ```

### With Docker

1.  Clone the repository:

    ```bash
    git clone https://github.com/matshp0/developsToday-test
    cd https://github.com/matshp0/developsToday-test

    ```

2.  Build and start the services:

    ```bash
    docker-compose up --build

    ```

    This will start the NestJS app and MongoDB in separate containers.

## Usage

### API Endpoints

- **GET /countries/available**
  - Returns a list of available countries.
  - Example: `http://localhost:3000/countries/available`

- **GET /countries/:code**
  - Retrieves detailed information (borders, population, flag) for a country by its code.
  - Example: `http://localhost:3000/countries/UA`

- **POST /users/:userId/calendar/holidays**
  - Adds selected holidays for a country to the user's calendar.
  - Request Body:

    ```json
    {
      "countryCode": "UA",
      "year": 2025,
      "holidays": ["New Year's Day", "International Women's Day"]
    }
    ```

  - Example: `http://localhost:3000/users/123/calendar/holidays`
