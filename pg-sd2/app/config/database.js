// Load environment variables from the .env file
require("dotenv").config();

// Export MySQL configuration settings as a module
module.exports = {
  host: process.env.DB_CONTAINER || "localhost",          // Database host (container name or localhost)
  port: process.env.DB_PORT || 3306,                      // MySQL port (default is 3306)
  user: process.env.MYSQL_ROOT_USER || "root",            // MySQL user
  password: process.env.MYSQL_ROOT_PASSWORD || "root",    // MySQL password
  database: process.env.MYSQL_DATABASE || "cooking_club", // Name of the database to use
  waitForConnections: true,                               // Enable connection queueing
  connectionLimit: 10,                                    // Maximum number of connections in the pool
  queueLimit: 0                                           // No limit for queued connection requests
};
