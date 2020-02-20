import { ApolloServer } from 'apollo-server-micro'
import parseCookies from 'micro-cookie'

import DB from '../../src/db'

const typeDefs = `
  type Query {
    hello (name: String = "World"): String
  }
`

const resolvers = {
  Query: {
    hello: async (_, { name }) => `Hello ${name}`
  }
}

const context = async ({ req, res }) => {
  return { req, res, db: await DB() }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: {
    settings: {
      'request.credentials': 'include'
    }
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default parseCookies(apolloServer.createHandler({ path: '/api/graphql' }))
