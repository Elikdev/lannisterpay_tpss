export const internalResponse = (
  status = true,
  data,
  statusCode = 200,
  message = "success"
) => {
  return {
    status,
    statusCode,
    message,
    data,
  }
}

export const errorResponse = (
  res,
  message = "NotOK",
  status = 400,
  data = {}
) => {
  return res.status(status).json({
    status: "NOT OK",
    message,
    response: data,
  })
}

export const successResponse = (
  res,
  message = "OK",
  status = 200,
  data = {}
) => {
  return res.status(status).json({
    ...data,
  })
}

// response-time-logger.js
export const logResponseTime = (req, res, next) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    console.log("%s : %fms", req.path, elapsedTimeInMs);
  });

  next();
}
