require("dotenv").config();                                // Load environment variables from .env file
const mysql = require('mysql2/promise');                   // Import MySQL library with promise support

// Database configuration settings
const config = {
  db: {
    host: process.env.DB_CONTAINER || 'localhost',        // MySQL host (Docker container or localhost)
    port: process.env.DB_PORT || 3306,                    // MySQL port (default 3306)
    user: process.env.MYSQL_ROOT_USER || 'root',          // MySQL user
    password: process.env.MYSQL_ROOT_PASSWORD || 'root',  // MySQL password
    database: process.env.MYSQL_DATABASE || 'cooking_club', // Database name
    waitForConnections: true,                             // Enable queueing of connection requests
    connectionLimit: 10,                                  // Maximum number of connections in the pool
    queueLimit: 0,                                        // No limit for the request queue
  },
};

// Create a connection pool for better performance
const pool = mysql.createPool(config.db);

// Function to test database connection when the server starts
async function testConnection() {
  try {
    const connection = await pool.getConnection();        // Get a connection from the pool
    console.log("✅ Connected to MySQL - Database:", config.db.database);
    connection.release();                                 // Release the connection back to the pool
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);                                      // Stop execution if database connection fails
  }
}
testConnection();                                         // Execute the connection test

// Function to execute SQL queries
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);      // Execute the query and return results
    return rows;
  } catch (error) {
    console.error("❌ SQL query error:", error);
    throw error;
  }
}

// Export the query function to be used in other parts of the application
module.exports = { query };
