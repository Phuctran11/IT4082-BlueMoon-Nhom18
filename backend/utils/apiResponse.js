const apiResponse = {
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  error: (res, message = 'Error', statusCode = 400, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(401).json({
      success: false,
      message
    });
  },

  serverError: (res, message = 'Internal server error', error = null) => {
    return res.status(500).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
};

module.exports = apiResponse;