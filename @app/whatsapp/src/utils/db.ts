import assert from 'assert'
import mongoose from 'mongoose'

export async function connect (): Promise<typeof mongoose> {
  assert(process.env.MONGO_URI !== undefined)

  return await mongoose.connect(process.env.MONGO_URI, {
    tls: true,
    ssl: true,
    retryReads: true,
    retryWrites: true
  })
}
