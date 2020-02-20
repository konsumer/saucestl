import { ApolloServer } from 'apollo-server-micro'
import parseCookies from 'micro-cookie'

const typeDefs = `
  type Query {
    hello(name: String = "World"): String
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name}`
  }
}

const context = ({ req, res }) => {
  return { req, res }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
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
