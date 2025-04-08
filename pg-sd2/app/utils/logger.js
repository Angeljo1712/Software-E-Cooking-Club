// Import Winston logging library
const { createLogger, format, transports } = require("winston");

// Destructure formatting utilities
const { combine, timestamp, printf, colorize } = format;

// Define custom log message format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: "info", // Default logging level
  format: combine(
    colorize(),   // Add color to console output for better readability
    timestamp(),  // Add timestamp to each log
    logFormat     // Apply custom log message format
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    // Additional transports (e.g., file, remote) can be added here
  ]
});

// Export the logger to be used throughout the application
module.exports = logger;
