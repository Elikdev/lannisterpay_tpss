import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT || 5000
export const DB_URL = process.env.port || "mongodb://127.0.0.1:27017/lannisterpay"
