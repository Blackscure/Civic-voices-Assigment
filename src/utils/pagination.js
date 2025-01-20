/**
 * Pagination utility function to handle skip and limit
 * @param {Object} query 
 * @param {number} page 
 * @param {number} limit 
 * @param {Object} model
 * @returns {Object}
 */
const paginate = async (query, page = 1, limit = 10, model) => {
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const skip = (parsedPage - 1) * parsedLimit;
  
    const transactions = await model.find(query)
      .sort({ dateCreated: -1 }) 
      .skip(skip)
      .limit(parsedLimit);
  
    const totalTransactions = await model.countDocuments(query);

    return {
      transactions,
      meta: {
        total: totalTransactions,
        page: parsedPage,
        limit: parsedLimit,
      },
    };
  };
  
  module.exports = paginate;
  