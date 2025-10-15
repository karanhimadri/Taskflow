-- Run this script in pgAdmin to set up the taskflow database

-- Create the database (if it doesn't exist)
CREATE DATABASE taskflow;

-- Connect to the taskflow database in pgAdmin before running the next commands
-- (Right-click on the taskflow database → Query Tool)

-- Verify the connection
SELECT version();

-- You can also check if tables exist after running the Spring Boot application
-- \dt
