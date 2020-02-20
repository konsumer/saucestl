const next = require('next')
const express = require('express')
const localDynamo = require('local-dynamo')

const { PORT = 3000, DYNAMO_PORT = 4567 } = process.env

const run = async () => {
  process.env.NODE_ENV = 'development'
  console.log(`NextJS on http://localhost:${PORT}`)
  console.log(`DynamoDB running on http://localhost:${DYNAMO_PORT}`)
  localDynamo.launch({
    port: DYNAMO_PORT,
    sharedDb: true,
    heap: '512m'
  })
  const app = next({ dev: true })
  await app.prepare()
  const expressServer = express()
  const handle = app.getRequestHandler()
  expressServer.all('*', async (req, res) => {
    await handle(req, res)
  })
  expressServer.listen(PORT)
}
run()
