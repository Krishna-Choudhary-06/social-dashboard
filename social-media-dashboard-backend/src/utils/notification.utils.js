const buildNotificationPayload = ({ workspaceId, userId, payload = {}, createdBy = null }) => ({
  workspaceId,
  userId,
  type: payload.type,
  title: payload.title,
  message: payload.message,
  metadata: payload.metadata || {},
  priority: payload.priority || 'medium',
  createdBy,
});

const normalizePagination = ({ page = 1, limit = 20 }) => ({
  page: Number(page) || 1,
  limit: Math.min(Number(limit) || 20, 100),
});

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
  buildNotificationPayload,
  normalizePagination,
  buildPagination,
};
