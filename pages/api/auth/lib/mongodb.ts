import { MongoClient, MongoClientOptions } from "mongodb"

const uri = process.env.MONGODB_URI as string
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as MongoClientOptions

let client
let clientPromise:Promise<MongoClient> | null = null


if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalAttrs = global as any
  if (!globalAttrs._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalAttrs._mongoClientPromise = client.connect()
  }
  clientPromise = globalAttrs._mongoClientPromise as Promise<MongoClient>
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect() as Promise<MongoClient>
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise