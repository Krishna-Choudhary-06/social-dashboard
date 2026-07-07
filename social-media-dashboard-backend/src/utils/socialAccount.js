const buildConnectedAccountQuery = (query = {}) => {
  const filter = {};

  if (query.platform) {
    filter.platform = query.platform;
  }

  if (query.workspaceId) {
    filter.workspaceId = query.workspaceId;
  }

  if (query.connectionStatus) {
    filter.connectionStatus = query.connectionStatus;
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  return {
    filter,
    pagination: { page, limit },
  };
};

module.exports = {
  buildConnectedAccountQuery,
};
