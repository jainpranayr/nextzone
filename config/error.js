import db from './db'

// get error message
const getError = err => {
  return err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message
}

// disconnect db and show error if error occurs
const onError = async (err, _req, res, _next) => {
  await db.disconnect()
  res.status(500).send({ message: err.toString() })
}

export { getError, onError }
