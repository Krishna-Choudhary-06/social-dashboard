const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error, statusCode = null) => {
  const status = statusCode || error.statusCode || 500;
  const payload = {
    success: false,
    message: error.message || 'Internal Server Error',
  };

  if (error.code) {
    payload.code = error.code;
  }

  return res.status(status).json(payload);
};

const buildPagination = (page, limit, total) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  sendSuccess,
  sendError,
  buildPagination,
};
