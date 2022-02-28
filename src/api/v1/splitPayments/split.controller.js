import {
  errorResponse,
  successResponse,
} from "../../../helpers/response.helpers"
import { feeService } from "./split.services"
import { computeFeeValidation } from "../../../helpers/validation"

const routes = (app) => {
  app.post(
    "/split-payments/compute",
    computeFeeValidation(),
    async (req, res) => {
      try {
        const response = await feeService.computeFees(req.body)
        if (!response.status) {
          return errorResponse(res, response.message, 400, response.data)
        }
        return successResponse(res, response.message, 200, response.data)
      } catch (error) {
        console.log(error)
        return errorResponse(
          res,
          "An error occured while processing the request",
          500
        )
      }
    }
  )
}

export default routes
