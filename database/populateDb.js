#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR ( 255 ) NOT NULL,
  lastname VARCHAR ( 255 ) NOT NULL,
  username VARCHAR ( 255 ) UNIQUE NOT NULL,
  hashedPassword VARCHAR ( 255 ) NOT NULL,
  membershipStatus BOOLEAN,
  isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author VARCHAR ( 255 ) REFERENCES users(username) ON DELETE CASCADE
);

INSERT INTO users (firstname, lastname, username, hashedPassword, membershipStatus, isAdmin) 
VALUES 
('Amritesh', 'Singh', 'amritesh@example.com', 'hashed_pass_123', TRUE, FALSE),
('Priya', 'Sharma', 'priya@example.com', 'hashed_pass_456', TRUE, TRUE),
('Rahul', 'Verma', 'rahul@example.com', 'hashed_pass_789', FALSE, FALSE),
('Sneha', 'Mishra', 'sneha@example.com', 'hashed_pass_000', TRUE, FALSE);

INSERT INTO messages (title, text, author) 
VALUES 
('Welcome!', 'Welcome to our platform. Glad to have you here!', 'amritesh@example.com'),
('Admin Notice', 'Please follow the community guidelines.', 'priya@example.com'),
('Daily Update', 'Heres what happened today in the world.', 'rahul@example.com'),
('Quote of the Day', 'Success is not final, failure is not fatal—it is the courage to continue that counts.', 'sneha@example.com');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
