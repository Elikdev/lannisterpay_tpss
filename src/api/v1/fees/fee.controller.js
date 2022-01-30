import { errorResponse, successResponse } from "../../../helpers/response.helpers";


const routes = (app) => {
 app.post("/fees", async(req, res) => {
  try {
   
  } catch (error) {
   console.log(error)
   return errorResponse(res, "An error occured while processing the request", 500)
   
  }
 })
 
 app.post("/compute-transaction-fee", async(req, res) => {
  try {
   
  } catch (error) {
   console.log(error)
   return errorResponse(res, "An error occured while processing the request", 500)
  }
 })

}

export default routes



