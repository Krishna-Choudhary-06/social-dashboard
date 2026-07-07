const getPaginationOptions = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMetadata = (page, limit, total) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
};

const getCursorPaginationMetadata = (limit, items) => {
  const hasNext = items.length > limit;
  if (hasNext) {
    items.pop();
  }
  const nextCursor = hasNext && items.length > 0 ? Buffer.from(items[items.length - 1]._id.toString()).toString('base64') : null;
  return {
    limit,
    hasNext,
    nextCursor
  };
};

module.exports = {
  getPaginationOptions,
  getPaginationMetadata,
  getCursorPaginationMetadata
};
