const { getPaginationOptions } = require('./pagination');

class QueryBuilder {
  constructor(query = {}) {
    this.query = query;
    this.filterObj = {};
    this.sortStr = '-createdAt';
    this.paginationOptions = getPaginationOptions(this.query);
  }

  search(searchFields = []) {
    if (this.query.search && searchFields.length > 0) {
      this.filterObj.$or = searchFields.map(field => ({
        [field]: { $regex: this.query.search, $options: 'i' }
      }));
    }
    return this;
  }

  filter(allowedFilters = []) {
    allowedFilters.forEach(field => {
      if (this.query[field] !== undefined && this.query[field] !== '') {
        if (typeof this.query[field] === 'string' && this.query[field].includes(',')) {
          this.filterObj[field] = { $in: this.query[field].split(',') };
        } else {
          this.filterObj[field] = this.query[field];
        }
      }
    });

    if (this.query.startDate || this.query.endDate) {
      this.filterObj.createdAt = {};
      if (this.query.startDate) this.filterObj.createdAt.$gte = new Date(this.query.startDate);
      if (this.query.endDate) this.filterObj.createdAt.$lte = new Date(this.query.endDate);
    }

    if (this.query.reportDateStart || this.query.reportDateEnd) {
      this.filterObj.reportDate = {};
      if (this.query.reportDateStart) this.filterObj.reportDate.$gte = new Date(this.query.reportDateStart);
      if (this.query.reportDateEnd) this.filterObj.reportDate.$lte = new Date(this.query.reportDateEnd);
    }

    return this;
  }

  sort(defaultSort = '-createdAt') {
    if (this.query.sort) {
      this.sortStr = this.query.sort.split(',').join(' ');
    } else {
      this.sortStr = defaultSort;
    }
    return this;
  }

  cursor(cursorField = '_id') {
    if (this.query.cursor) {
      try {
        const decodedCursor = Buffer.from(this.query.cursor, 'base64').toString('ascii');
        // Default cursor comparison logic (assumes descending order)
        this.filterObj[cursorField] = { $lt: decodedCursor };
      } catch (e) {
        // Invalid cursor format, ignore
      }
    }
    return this;
  }

  build() {
    return {
      filter: this.filterObj,
      sort: this.sortStr,
      skip: this.paginationOptions.skip,
      limit: this.paginationOptions.limit,
      page: this.paginationOptions.page,
    };
  }
}

module.exports = QueryBuilder;
