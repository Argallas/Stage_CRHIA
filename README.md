# Espect@tor
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Build](https://github.com/celluloid-camp/celluloid/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/celluloid-camp/celluloid/actions/workflows/build.yml)
[![Gitter chat](https://badges.gitter.im/celluloid-camp.png)](https://gitter.im/celluloid-camp)

## What is this?

Espect@tor is a collaborative video annotation application designed for educational purposes.

Find a [PeerTube](https://joinpeertube.org/) video, choose an educational objective, annotate the video, share it with your students,
collect their answers, answer their questions.

## ✨ Demo

Head to https://especellu.huma-num.fr/, create an account and click where you think you should!

We'd appreciate your feedback about the application UX and design, as well as bug reports - don't hesitate to [report an issue!](https://github.com/celluloid-camp/celluloid/issues)


## Who's behind it?

Espect@tor was born from a research project lead by **CHANTRAINE Cécile** (cecile.chantraine_braillon@univ-lr.fr),
a professor at [La Rochelle Université](https://www.univ-larochelle.fr/).
Their work focus on educational science and digital humanities.

Espect@tor is maintained by [LARBI Maya](https://github.com/mayalb), and **we are actively looking for contributors and maintainers**.
Don't hesitate to [drop us a line on gitter!](https://gitter.im/celluloid-camp)

# Setup

## Prerequisites

### Environment

Espect@tor was designed to run on a Linux server.

To deploy and install Espect@tor, knowing your way around the command-line is required. **Using an OSX or Linux workstation is highly recommended**.

### Tools

- install the latest and greatest version of [git](https://git-scm.com/) (obviously)
- install the latest version of [nodejs](https://nodejs.org/en/)
- install the latest version of [Yarn](https://yarnpkg.com/en/) and use it instead of NPM. The project is organized as a [monorepo](https://blog.scottlogic.com/2018/02/23/javascript-monorepos.html) so it needs yarn to leverage [Yarn workspace](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/)

### 📦 Database

You'll need a working [PostgreSQL server](https://www.postgresql.org/docs/current/static/tutorial-install.html), version 9.6 or later.

For development purpose, you can use the provided Docker Compose [docker compose file](docker-compose.yml) and run the command: 

    docker-compose up -d

Then:

1. [create a user](https://www.postgresql.org/docs/current/static/app-createuser.html) for Espect@tor
2. [create a database](https://www.postgresql.org/docs/current/static/manage-ag-createdb.html) owned by this user. You can follow [this tutorial](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) to get setup quickly.

### Emails

A working SMTP server is required to send account confirmation emails.

For development purpose, you could use your email account SMTP credentials, for instance [gmail](https://support.google.com/a/answer/176600?hl=en), or a dedicated service, such as [mailtrap](https://mailtrap.io/register/signup)

## Installation from source

### First steps

Fire up a terminal and run the following commands:

    git clone https://github.com/celluloid-camp/EspeCelluloid
    cd EspeCelluloid/
    yarn

### Configuration

In a terminal, at the root of the repository, run

    cp sample.env .env

Open the newly created .env file with your favorite text editor and set the values that'll work for you.


### Docker container

For a quick run use the docker command line :

    docker container run --rm --name especulloid \
    -e CELLULOID_PG_HOST='localhost' \
    -e CELLULOID_PG_PORT=5432  \
    -e CELLULOID_PG_DATABASE='celluloid' \
    -e CELLULOID_PG_USER='postgres' \
    -e CELLULOID_PG_PASSWORD='root' \
    -e CELLULOID_COOKIE_SECRET='XXX' \
    --net=host \
    ghcr.io/celluloid-camp/especulloid :v1


### Running the app in development mode

At the root of your repository, run

    yarn dev

This will trigger an interactive build, open up the app in a browser window while continuously watching the source files for modifications.

**that's it!** if everything worked without errors, you should be all set. If not, please carefully review the instructions above.

### Building and starting the app in production mode

At the root of your repository, run

    yarn build
    yarn start

You should be able to access your app at http://localhost:3001

### Building and starting the app as a docker container

Open a terminal at the root of your repository, then run

    docker compose -f Dockerfile

(make sure [Docker](https://www.docker.com/get-started) is properly installed beforehand!)

# Contributing

**We are actively looking for motivated contributors!**.

Do not hesitate to open a pull request, [contact us on gitter](https://gitter.im) or [report a bug!](https://github.com/celluloid-camp/celluloid/issues)

## Roadmap
- Administration GUI: content curation and moderation, user administration
- Real-time annotation and comment updating using Websockets or SSE


## Technical Stack

Before contributing to the development of Espect@tor, you should get familiar with some of the following technologies:

- everywhere: [TypeScript](https://www.typescriptlang.org/)
- frontend: [React](https://reactjs.org/), [Redux](https://redux.js.org/) and [Material UI](https://material-ui.com/)
- backend: [node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) and [knex](https://knexjs.org/)
- storage: [PostgreSQL](https://www.postgresql.org/)


