# Restify

This is a start kit for building JWT based REST API with Node.js, Express and MongoDB which includes user authentication and session based authentication for web apps.

## Features

- JWT Authentication (API)
- Session Authentication (Web)
- User Authentication (Full Stack)

## Tech Stack

- [JWT](https://jwt.io)
- [Next](https://nextjs.org)
- [Node.js](https://nodejs.org)
- [MongoDB](https://mongodb.com)
- [SWR](https://swr.vercel.app)
- [Express](https://expressjs.com)
- [Mono Repo](https://trubo.build)
- [Mongoose](https://mongoosejs.com)
- [ESbuild](https://esbuild.github.io)
- [Helmet](https://helmetjs.github.io)
- [Zod](https://www.npmjs.com/package/zod)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [React Hook Form](https://react-hook-form.com)
- [Consola](https://www.npmjs.com/package/consola)
- [Axios](https://www.npmjs.com/package/axios)
- [Cookie Parser](https://www.npmjs.com/package/cookie-parser)

## Architecture

- MVC
- REST
- Mono Repo

## Directory Structure

```
.
├── apps
│   ├── backend
│   │   └── src
│   │       ├── config
│   │       ├── controllers
│   │       ├── middlewares
│   │       ├── models
│   │       ├── routes
│   │       ├── schemas
│   │       ├── services
│   │       └── utils
│   └── client
│       ├── app
│       │   ├── auth
│       │   │   ├── login
│       │   │   └── register
│       │   ├── hooks
│       │   └── utils
│       ├── pages
│       │   └── api
│       └── public
└── packages
    └── tsconfig
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
