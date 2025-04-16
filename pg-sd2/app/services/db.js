// Import required modules
const mysql = require("mysql2/promise");                 // MySQL client with Promise support
const config = require("../config/database");            // Custom database configuration
const logger = require("../utils/logger");               // Custom logger utility

// Create a connection pool for efficient query handling
const pool = mysql.createPool(config);

// Test database connection when the server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();       // Get a connection from the pool
    logger.info(`✅ Connected to MySQL - Database: ${config.database}`); // Log success
    connection.release();                                // Release connection back to the pool
  } catch (error) {
    logger.error("❌ Database connection failed: " + error.message); // Log error
    process.exit(1);                                      // Terminate app if DB connection fails
  }
}
testConnection(); // Execute the connection test on startup

// Query execution wrapper for consistent logging and error handling
async function query(sql, params) {
  try {
    const start = Date.now();                            // Record start time for timing
    const [rows] = await pool.execute(sql, params);      // Execute SQL query
    const duration = Date.now() - start;                 // Calculate execution time
    logger.info(`✅ Query executed in ${duration}ms`);   // Log the duration
    return rows;                                         // Return query results
  } catch (error) {
    logger.error("❌ SQL query error: " + error.message); // Log error
    throw error;                                         // Re-throw to handle elsewhere
  }
}

// Handle graceful shutdown (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  await pool.end();                                      // Close the connection pool
  logger.info("🛑 MySQL pool closed on shutdown");        // Log pool closure
  process.exit(0);                                       // Exit process cleanly
});

// Export the query method and the pool itself
module.exports = {
  query,
  pool
};
