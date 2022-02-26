// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '../../config/db'

export default async function handler(req, res) {
  await db.connect()
  res.status(200).json({ message: 'Database Connected' })
}
