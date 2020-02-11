import faunadb from 'faunadb'
import getId from './utils/getId'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
})

exports.handler = async (event, context, callback) => {
  const id = getId(event.path)
  try {
    const response = await client.paginate(
      q.Match(q.Index('user_search_by_username'), id)
    )

    response.each(async a => {
      const user = await client.query(q.Get(a[0]))
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(user),
      })
    })
  } catch (error) {
    console.log('error', error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error),
    })
  }
}
