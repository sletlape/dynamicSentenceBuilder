
# Dynamic Sentence Builder Backend

A backend and API for the Dynamic Sentence Builder app. It's built in Node.js and Express.js and uses Posgres for the DB.  Using Mocha and Chai for testing

## Authors

- [Khumo Letlape](https://www.github.com/sletlape)


## Run Locally

You can run with the app or without [Docker](https://www.docker.com/) but you need to have [Postgres](https://www.postgresql.org/) installed.

### Step 1:
If not already done, clone the project
```bash
  git clone sletlape/dynamicSentenceBuilder
```

### Step 2:
Go to the backend directory
```bash
  cd dynamicSentenceBuilder
  cd BackEnd
```

### Step 3:
Install dependencies
```bash
  npm install
```

### Step 4:
Start the server (no Docker)
```bash
  npm run start
```

### Step 5:
Start the Docker server (first time)
```bash
    docker-compose up --build
```
Building Docker may bring up some errors just try moving on to the next step (6). If error persists, try building again or google the error.

### Step 6:
Start the Docker (if already built)
```bash
    docker-compose up
```

### Step 7:
Run tests.

## Running the test

Run tests (no Docker)
```bash
  npm run test
```

Run tests in Docker
```bash
    docker-compose -f docker-compose.test.yml up --build
```