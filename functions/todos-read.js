import { Client } from 'pg'
import getId from './utils/getId'

exports.handler = async (event, context, callback) => {
  const id = getId(event.path)
  const client = new Client({
    user: 'daichuqi',
    host: 'chuqilab.c2ls2eak4iwb.us-west-2.rds.amazonaws.com',
    database: 'mydb',
    password: '123456789',
    port: 5432,
  })

  try {
    await client.connect()
    const res = await client.query(
      `SELECT * FROM users WHERE username='${id}';`
    )

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(res.rows[0]),
    })
  } catch (error) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error),
    })
  } finally {
    client.end()
  }
}
