import mongoose from 'mongoose'

// an emoty object to store whether we are connected to database or not
const connection = {}

// connecting to database
async function connect() {
  // check if we are connected to database
  if (connection.isConnected) {
    console.log('database - already connected.')
    return
  }

  // check for previously connected database
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      console.log('database - previous connection used.')
      return
    }
    // if not connected to any database disconnect
    await mongoose.disconnect()
  }

  // create a new connection
  const db = await mongoose.connect(process.env.MONGODB_URI)
  console.log('database - new connection created.')
  connection.isConnected = db.connections[0].readyState
}

// disconnecting database
async function disconnect() {
  // if already connected
  if (connection.isConnected) {
    // if in production mode
    if (process.env.NODE_ENV === 'production') {
      // disconnect database
      await mongoose.disconnect()
      connection.isConnected = false
    } else {
      // do not disconnect database
      console.log('database - not disconnected')
    }
  }
}

// converting mongodb id, createdAt, updatedAt to string
function convertDocToObj(doc) {
  doc._id = doc._id.toString()
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()

  return doc
}

const db = { connect, disconnect, convertDocToObj }
export default db
