/**
 * Pagination utility function to handle skip and limit
 * @param {Object} query - The query object to filter results.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of results per page.
 * @param {Object} model - The Mongoose model to paginate.
 * @returns {Object} - Returns an object containing the transactions and metadata.
 */
const paginate = async (query, page = 1, limit = 10, model) => {
    // Ensure page and limit are valid numbers
    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, parseInt(limit, 10));
  
    // Calculate skip and limit for pagination
    const skip = (parsedPage - 1) * parsedLimit;
  
    // Fetch paginated data from the model
    const transactions = await model.find(query)
      .sort({ dateCreated: -1 }) // Sort by newest first
      .skip(skip)
      .limit(parsedLimit);
  
    // Get the total count of matching transactions
    const totalTransactions = await model.countDocuments(query);
  
    // Return transactions with pagination metadata
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
  