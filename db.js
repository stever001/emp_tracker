const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your username
    password: 'boise001.',  // Replace with your password
    database: 'employee_tracker'
});
connection.connect(err => {
    if (err) throw err;
});
module.exports = connection;