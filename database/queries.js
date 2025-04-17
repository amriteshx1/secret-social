const pool = require("./pool");

async function insertNewUser(firstname, lastname, username, password){
    await pool.query("INSERT INTO users (firstname, lastname, username, hashedPassword) VALUES ($1, $2, $3, $4)", [firstname, lastname, username, password]);
}