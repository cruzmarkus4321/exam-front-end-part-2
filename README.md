# Exam Front-End Part 2

Welcome to the Exam Front-End Part 2 project, a SvelteKit application focused on Employee Management with CRUD operations. This project aims to provide a user-friendly interface for efficiently managing employee information, enabling Create, Read, Update, and Delete operations seamlessly.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/cruzmarkus4321/exam-front-end-part-2.git
    ```

2. Navigate to the project directory:

    ```bash
    cd exam-front-end-part-2
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

Configure the GraphQL endpoint in the `src/lib/js/urqlClient.js` file:

```javascript
const client = createClient({
  url: 'http://localhost:8080/graphql', // Replace with your GraphQL endpoint
  exchanges: [cacheExchange, fetchExchange],
  maskTypename: true
});
```

## Usage

1. Run the application using npm:

    ```bash
    npm run dev
    ```

2. Open your web browser and navigate to [http://localhost:5173](http://localhost:5173)
