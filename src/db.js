// this is loaded server-side only, to get database

const AWS = require('aws-sdk')
const YAML = require('yaml')

const getDbConfig = async () => {
  const { readFile } = require('fs').promises
  const yml = YAML.parse((await readFile(`${process.env.ROOT}/serverless.yml`)).toString())
  const { name, attributeDefinitions, keySchema } = Object.values(yml).filter(thing => thing.component === '@serverless/aws-dynamodb')[0].inputs
  return {
    TableName: name,
    AttributeDefinitions: attributeDefinitions,
    KeySchema: keySchema,
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }
}

module.exports = async () => {
  let db
  if (process.env.NODE_ENV === 'development') {
    AWS.config.update({
      region: 'local',
      endpoint: `http://localhost:${process.env.DYNAMO_PORT}`
    })
    db = new AWS.DynamoDB.DocumentClient()
    // create the table for dev
    db.dynamodb = new AWS.DynamoDB()
    const cfg = await getDbConfig()
    await new Promise((resolve, reject) => {
      db.dynamodb.createTable(cfg, (err, res) => {
        if (!err) {
          return reject(err)
        }
        resolve(res)
      })
    })
  } else {
    db = new AWS.DynamoDB.DocumentClient()
  }
  return db
}
