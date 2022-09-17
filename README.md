# Docker, NodeJS, Typescript, DDD, MongoDB, Auth
> RESTful api with Domain Driven Design

## Features
* Docker
* NodeJS (+14)
* Typescript
* MongoDB

## Getting Started

Run in development:

```sh
$ npm run watch-debug
```

with docker:

```sh
$ docker-compose up -d
```

Run in production:
```sh
$ run.sh
```
or
```sh
$ npm run build
$ npm run serve
```

Run linter:
```sh
$ npm run tslint
```

Run tests:
```sh
$ npm run test
```

## Tech

- [TypeScript](https://www.typescriptlang.org/) - TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
- [Express](https://expressjs.com/) - Node Framweork.
- [Awilix](https://github.com/jeffijoe/awilix) - dependency resolution support powered by `Proxy`.
- [Nodemon](https://nodemon.io/) - Use for development file reload.
- [Tcomb](https://github.com/gcanti/tcomb) - s a library for Node.js and the browser which allows you to check the types of JavaScript values at runtime with a simple and concise syntax.
- [CORS](https://github.com/expressjs/cors) - a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [Body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware.
- [Http-status](https://github.com/adaltas/node-http-status) - Utility to interact with HTTP status code.
- [Winston](https://github.com/winstonjs/winston) - A multi-transport async logging library for node.js.
- [Sequelize](https://mongoosejs.com/) - mongoDB object modeling designed to work in an asynchronous environment.
- [Faker](https://github.com/marak/Faker.js/) - generate massive amounts of fake data in the browser and node.js
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Lib to help you hash passwords
- [Passport](https://github.com/jaredhanson/passport) - is Express-compatible authentication middleware for Node.js.
- [Passport-jwt](https://github.com/themikenicholson/passport-jwt) - A Passport strategy for authenticating with a JSON Web Token.
- [Json Webtoken](https://github.com/auth0/node-jsonwebtoken) - An implementation of JSON Web Tokens.

### Logging
- [winston](https://github.com/winstonjs/winston) - a multi-transport async logging library for Node.js. It is designed to be a simple and universal logging library with support for multiple transports. A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file.
- [morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware for Node.js. A helper that collects logs from your server, such as your request logs.

### Tests
- [supertest](https://github.com/visionmedia/supertest) - HTTP assertions made easy via superagent.
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) - Spinning up mongod in memory for fast tests. If you run tests in parallel this lib helps to spin up dedicated mongodb servers for every test file in MacOS, *nix, Windows or CI environments (in most cases with zero-config).


