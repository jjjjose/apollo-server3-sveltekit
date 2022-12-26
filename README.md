# apollo-server3-sveltekit

Welcome to the integration of Apollo Server 3 and SvelteKit! This combination is ideal for the development of efficient and smooth web applications. SvelteKit provides you with an easy-to-use tool to create powerful web apps with Apollo Server 3. With this library, you can fully utilize the capabilities of both frameworks to create amazing applications.

## Installation

To install this module, run the following command in your terminal:

```bash
npm install apollo-server3-sveltekit
```

or

```bash
yarn add apollo-server3-sveltekit
```

## Preparation

Before anything, you must create a file `+server.ts` in the `src/routes/api/` folder of your SvelteKit project.

## Usage

- To use this function, first import it in your code:

  ```js
  import { createHandler } from 'apollo-server3-sveltekit'
  ```

- then you can use the `createHandler` function to create an Apollo Server handler:

  ```js
  const typeDefs = `
  type Query {
    ping: String
  }
  `

  const resolvers = {
    Query: {
      ping: () => {
        return 'pong'
      },
    },
  }

  const handler = createHandler({
    typeDefs,
    resolvers,
    context: (params: any) => params,
  })

  export { handler as GET, handler as POST }
  ```

## Information

If you want to make more advanced configurations or see the difference of apollo server 4 with older versions, you can see the official Apollo Server documentation
<a href="https://www.apollographql.com/docs/apollo-server/" target="_blank">here</a>.

## License

- <a href="https://github.com/jjjjose/apollo-server3-sveltekit/blob/main/LICENSE" target="_blank">MIT</a>

---

Created by <a href="https://github.com/jjjjose" target="_blank">jjjjose</a> - 2022
