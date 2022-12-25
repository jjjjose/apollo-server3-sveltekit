import { runHttpQuery, ApolloServerBase } from 'apollo-server-core'
import { Headers as ApolloHeaders } from 'apollo-server-env'

class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions(req: any) {
    return await super.graphQLServerOptions({ req })
  }
  handleRequest = async (req: any) => {
    let headersObject = req.request.headers
    const acceptedTypes = (req.request.headers.get('Accept') || '')
      .toLowerCase()
      .split(',')
    const landingPage = this.getLandingPage()
    if (
      landingPage &&
      req.request.method === 'GET' &&
      !req.url.searchParams.get('query') &&
      acceptedTypes.includes('text/html')
    ) {
      return new Response(landingPage.html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
    return runHttpQuery([req], {
      method: req.request.method,
      options: () => this.createGraphQLServerOptions(req),
      query:
        req.request.method == 'POST'
          ? await req.request.json()
          : req.url.searchParams.get('query')
          ? {
              query: req.url.searchParams.get('query'),
              variables: req.url.searchParams.get('variables'),
              operationName: req.url.searchParams.get('operationName'),
              extensions: req.url.searchParams.get('extensions'),
            }
          : null,
      request: {
        url: req.url.pathname,
        headers: new ApolloHeaders(headersObject),
        method: req.request.method,
      },
    }).then(
      ({ graphqlResponse, responseInit }) => {
        return new Response(graphqlResponse, responseInit)
      },
      (error) => {
        if ('HttpQueryError' !== error.name) throw error
        return new Response(error.message, {
          status: error.statusCode,
          headers: error.headers,
        })
      }
    )
  }
}

export function createHandler(options: {
  typeDefs?: any
  resolvers?: any
  schema?: any
  context?: any
}) {
  const defaultContext = async () => ({})
  const contextFunction = options?.context ?? defaultContext
  const createApolloServer = (params: any) => {
    return new ApolloServer({
      ...options,
      cache: 'bounded',
      context: () => contextFunction(params),
    })
  }
  const fn = async (req: any) => {
    const server = createApolloServer(req)
    await server.start()
    const resp = await server.handleRequest(req)
    server.stop()
    return resp
  }

  return fn
}
