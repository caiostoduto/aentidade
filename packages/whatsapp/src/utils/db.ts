import mongoose from 'mongoose'

export async function connect (): Promise<typeof mongoose> {
  return await mongoose.connect(process.env.MONGO_URI as string, {
    tls: true,
    ssl: true,
    retryReads: true,
    retryWrites: true
  })
}
