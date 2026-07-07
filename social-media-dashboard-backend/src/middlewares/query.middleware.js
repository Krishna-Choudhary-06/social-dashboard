const QueryBuilder = require('../utils/queryBuilder');

const queryMiddleware = (options = {}) => {
  const { 
    searchFields = [], 
    allowedFilters = [], 
    defaultSort = '-createdAt', 
    useCursor = false, 
    cursorField = '_id' 
  } = options;

  return (req, res, next) => {
    try {
      const builder = new QueryBuilder(req.query)
        .search(searchFields)
        .filter(allowedFilters)
        .sort(defaultSort);
        
      if (useCursor) {
        builder.cursor(cursorField);
      }

      req.queryOptions = builder.build();
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = queryMiddleware;
