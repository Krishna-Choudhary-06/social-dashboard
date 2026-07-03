const buildUserQuery = (query = {}) => {
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) filter.$or = [
    { name: { $regex: query.search, $options: 'i' } },
    { email: { $regex: query.search, $options: 'i' } },
  ];

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));

  return {
    filter,
    pagination: { page, limit },
  };
};

module.exports = {
  buildUserQuery,
};
