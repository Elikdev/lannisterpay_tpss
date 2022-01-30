import express from "express"
import cors from "cors"
import morgan from "morgan"
import routes from "./api/v1/fees/fee.controller"
import { errorResponse } from "./helpers/response.helpers"
import { isCelebrateError } from "celebrate"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

app.get("/", (req, res) => {
  return res.status(200).json({
    error: false,
    data: {},
    message: "Welcome to this new server",
  })
})

routes(app)

app.use("*", (req, res) => {
  return errorResponse(res, "Route not found", 404)
})

app.use((error, _req, res, next) => {
  if (isCelebrateError(error)) {
    const errorMessage =
      error.details.get("body") ||
      error.details.get("query") ||
      error.details.get("params")

    const message = errorMessage?.message.replace(/"/g, "")
    return errorResponse(res, message)
  }
  next()
})

export default app
