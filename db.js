const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'boise001',
    database: 'employee_tracker'
});
connection.connect(err => {
    if (err) throw err;
});
module.exports = connection;