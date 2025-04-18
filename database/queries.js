const pool = require("./pool");

async function insertNewUser(firstname, lastname, username, password){
    await pool.query("INSERT INTO users (firstname, lastname, username, hashedPassword) VALUES ($1, $2, $3, $4)", [firstname, lastname, username, password]);
}

async function findUserByEmail(username){
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows[0];
}

async function findUserById(id){
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
}

async function becomeMember(username){
    await pool.query("UPDATE users SET membershipStatus = true WHERE username = $1", [username]);
}

module.exports = {
    insertNewUser,
    findUserByEmail,
    findUserById,
    becomeMember
};