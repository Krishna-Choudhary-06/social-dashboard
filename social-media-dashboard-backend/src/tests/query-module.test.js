const QueryBuilder = require('../utils/queryBuilder');
const { getPaginationOptions, getPaginationMetadata, getCursorPaginationMetadata } = require('../utils/pagination');
const queryMiddleware = require('../middlewares/query.middleware');

describe('Query Module Utilities', () => {
  describe('Pagination Utility', () => {
    it('should generate default pagination options', () => {
      const options = getPaginationOptions({});
      expect(options.page).toBe(1);
      expect(options.limit).toBe(10);
      expect(options.skip).toBe(0);
    });

    it('should parse valid pagination options', () => {
      const options = getPaginationOptions({ page: '2', limit: '20' });
      expect(options.page).toBe(2);
      expect(options.limit).toBe(20);
      expect(options.skip).toBe(20);
    });

    it('should calculate correct pagination metadata', () => {
      const meta = getPaginationMetadata(2, 20, 45);
      expect(meta.page).toBe(2);
      expect(meta.limit).toBe(20);
      expect(meta.total).toBe(45);
      expect(meta.totalPages).toBe(3);
      expect(meta.hasNext).toBe(true);
      expect(meta.hasPrevious).toBe(true);
    });
  });

  describe('QueryBuilder', () => {
    it('should build filter with allowed fields', () => {
      const builder = new QueryBuilder({ role: 'admin', status: 'active', unallowed: '123' });
      builder.filter(['role', 'status']);
      const result = builder.build();
      
      expect(result.filter.role).toBe('admin');
      expect(result.filter.status).toBe('active');
      expect(result.filter.unallowed).toBeUndefined();
    });

    it('should build search with regex', () => {
      const builder = new QueryBuilder({ search: 'john' });
      builder.search(['username', 'email']);
      const result = builder.build();
      
      expect(result.filter.$or).toBeDefined();
      expect(result.filter.$or.length).toBe(2);
      expect(result.filter.$or[0].username.$regex).toBe('john');
    });

    it('should handle sorting', () => {
      const builder = new QueryBuilder({ sort: 'name,-createdAt' });
      builder.sort();
      const result = builder.build();
      
      expect(result.sort).toBe('name -createdAt');
    });

    it('should handle date ranges', () => {
      const builder = new QueryBuilder({ startDate: '2023-01-01', endDate: '2023-12-31' });
      builder.filter();
      const result = builder.build();

      expect(result.filter.createdAt.$gte).toEqual(new Date('2023-01-01'));
      expect(result.filter.createdAt.$lte).toEqual(new Date('2023-12-31'));
    });
  });

  describe('Query Middleware', () => {
    it('should attach queryOptions to req object', () => {
      const req = {
        query: {
          search: 'test',
          status: 'pending',
          page: '2'
        }
      };
      const res = {};
      const next = jest.fn();

      const middleware = queryMiddleware({
        searchFields: ['name'],
        allowedFilters: ['status']
      });

      middleware(req, res, next);

      expect(req.queryOptions).toBeDefined();
      expect(req.queryOptions.filter.status).toBe('pending');
      expect(req.queryOptions.filter.$or[0].name.$regex).toBe('test');
      expect(req.queryOptions.page).toBe(2);
      expect(next).toHaveBeenCalled();
    });
  });
});
