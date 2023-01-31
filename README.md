# Restify

This is a start kit for building JWT based REST API with Node.js, Express and MongoDB.

## Features

- JWT Authentication
- User Authentication
- Production ready

## Tech Stack

- [Mono Repo](https://trubo.build)
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [MongoDB](https://mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [JWT](https://jwt.io)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Helmet](https://helmetjs.github.io)
- [ESbuild](https://esbuild.github.io)
- [Zod](https://www.npmjs.com/package/zod)
- [Consola](https://www.npmjs.com/package/consola)

## Architecture

- Mono Repo
- MVC

## Directory Structure

```
.
├── apps
│   └── backend                 # backend app
│       └── src     
│           ├── config          # config files
│           ├── controllers     # express controllers
│           ├── middlewares     # express middlewares
│           ├── models          # mongoose models
│           ├── routes          # routes
│           ├── schemas         # validation schemas
│           ├── services        # business logic (i.e think as service pattern)
│           └── utils           # utility functions
└── packages
    └── tsconfig                      # tsconfig package
```

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build
```

## License

[MIT](./LICENSE)
