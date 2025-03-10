#  Fullstack Webstie Coding Test work order manufacture
Easy setup dev environment

### Working time:
- 4 days

#### Tech Stack:
- Laravel
- React, Inertia JS
- PostgresQL

## Requirements:
- git
- docker compose
- php
- composer

---

# All the things to get started:
- first, clone the git repo, `this will install on the path you're on!`.
  
  ```bash
  git clone https://github.com/raihandotmd/code_test-work-order.git raihan-work-orders-management/ && cd raihan-work-orders-management/
  ```
- after that, we need to setup our `.env` or just use defaut `.env.example` template that i have configured.
  
  ```bash
  cp .env.example .env
  ```
- then, we need to change directory and start docker compose which install `adminer` & `postGresQL` in **isolated container** environment.
  with `-d` for detaching it.
  
  ```bash
  docker compose up -d
  ````

- we can now start installing composer `depedencies` & migrate our database and seeding it (fills with data).
  also imported `nilai.sql` in container.
  ```bash
  composer install && php artisan migrate --seed
  ```
- then, since i'm using nodeJS for it's frontend which is react, install it's depedencies:
    ```bash
    npm install
    ```

- finally, now we can start the web api application.

  ```bash
  composer run dev
  ```
---

# Accessing the website
The url web API is on:
`http://localhost:8000`

---
For the adminer, which used to see the database, can go to:
`http://localhost:9000`
