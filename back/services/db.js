import { MongoClient } from "mongodb"

const { MONGO_URI, DB_NAME = "barriopoli" } = process.env

if (!MONGO_URI) throw new Error("Falta MONGO_URI en el archivo .env")

const client = new MongoClient(MONGO_URI)

export const db = client.db(DB_NAME)
