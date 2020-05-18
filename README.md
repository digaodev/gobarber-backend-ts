<h1 align="center">
  <img alt="Logo" src="https://github.com/digaodev/gobarber-backend-ts/blob/master/docs/logo.svg?raw=true" width="200px">
</h1>

<h3 align="center">
  Express API for the GoBarber project
</h3>

<p align="center">A useful and intuitive way to manage your appointments</p>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/digaodev/gobarber-backend-ts?color=%23FF9000">

  <a href="https://www.linkedin.com/in/rodrigorb/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-digaodev-%23FF9000">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/digaodev/gobarber-backend-ts?color=%23FF9000">

  <a href="https://github.com/digaodev/gobarber-backend-ts/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/digaodev/gobarber-backend-ts?color=%23FF9000">
  </a>

  <a href="https://github.com/digaodev/gobarber-backend-ts/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/digaodev/gobarber-backend-ts?color=%23FF9000">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/digaodev/gobarber-backend-ts?color=%23FF9000">
</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

## About the project

This repository contains the backend api consumed by the web and mobile applications for the GoBarber project, a way to organize appointments for barbers and their customers.

To see the **web app**, go to [GoBarber Web](https://github.com/digaodev/gobarber-frontend-ts)<br />

To see the **mobile app**, go to [GoBarber Mobile](https://github.com/digaodev/gobarber-mobile-ts)

## Main Technologies

These are the main techs used in this project:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [TypeORM](https://typeorm.io/#/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/)

## Getting Started

Import the `Insomnia.json` on the Insomnia App or click on [Run in Insomnia](#insomniaButton) button below

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- A running instance of [PostgreSQL](https://www.postgresql.org/)(try using docker for an easier database setup)

**Clone the project and access the folder**

```bash
$ git clone https://github.com/digaodev/gobarber-backend-ts.git && cd gobarber-backend-ts
```

**Go through the following steps**

```bash
# Install the dependencies
$ yarn

# Create the instance of postgreSQL using docker
$ docker run --name gobarber-postgres -e POSTGRES_USER=postgres \
              -e POSTGRES_DB=gostack_gobarber -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Adjust the values for 'ormconfig.json' if needed, according to your preferences
# in order to connect with docker database container

# Once the services are running, run the migrations
$ yarn typeorm migration:run

# Check if the migrations were successfully run (compare with the files in 'src/database/migrations')
$ yarn typeorm migration:show

# To finish, run the api service
$ yarn dev:server

# All done, hopefully the project is setup and running!
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made by [digaodev](https://www.linkedin.com/in/rodrigorb/)
