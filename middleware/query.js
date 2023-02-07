exports.query = async (req, res, next) => {
  const { search, limit, page } = req.query;

  req.search = search;
  req.pagination = {
    limit: limit && parseInt(limit) ? parseInt(limit) : 10,
    page: page && parseInt(page) > 1 ? parseInt(page) : 1,
    skip:
      ((page && parseInt(page) > 1 ? parseInt(page) : 1) - 1) *
      (limit && parseInt(limit) ? parseInt(limit) : 10),
  };

  next();
};

/**
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 */