const buildOrganizationQuery = (query = {}) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { slug: { $regex: query.search, $options: 'i' } },
    ];
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  return {
    filter,
    pagination: { page, limit },
  };
};

module.exports = {
  buildOrganizationQuery,
};
