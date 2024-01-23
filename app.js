const inquirer = require('inquirer');
const connection = require('./db');

function start() {

    console.log("");
    console.log("");
    console.log("======================================");
    console.log("          Employee Tracker            ");
    console.log("======================================");
    console.log("");

    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllRoles() {
    connection.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        connection.query('INSERT INTO department SET ?', { name: answer.departmentName }, (err, res) => {
            if (err) throw err;
            console.log(`Department added: ${answer.departmentName}`);
            start();
        });
    });
}

    function addRole() {
        connection.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;
    
            inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the title of the role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of the role?',
                    validate: value => !isNaN(value)
                },
                {
                    name: 'department',
                    type: 'list',
                    choices: departments.map(department => department.name),
                    message: 'Which department does this role belong to?'
                }
            ]).then(answers => {
                let selectedDepartment = departments.find(dept => dept.name === answers.department);
                connection.query('INSERT INTO role SET ?', {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: selectedDepartment.id
                }, (err, res) => {
                    if (err) throw err;
                    console.log(`Role added: ${answers.title}`);
                    start();
                });
            });
        });
    }
    

    function addEmployee() {
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
    
            connection.query('SELECT * FROM employee', (err, employees) => {
                if (err) throw err;
    
                inquirer.prompt([
                    {
                        name: 'firstName',
                        type: 'input',
                        message: 'What is the employee\'s first name?'
                    },
                    {
                        name: 'lastName',
                        type: 'input',
                        message: 'What is the employee\'s last name?'
                    },
                    {
                        name: 'role',
                        type: 'list',
                        choices: roles.map(role => role.title),
                        message: 'What is the employee\'s role?'
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        choices: ['None'].concat(employees.map(emp => emp.first_name + ' ' + emp.last_name)),
                        message: 'Who is the employee\'s manager?'
                    }
                ]).then(answers => {
                    let selectedRole = roles.find(role => role.title === answers.role);
                    let selectedManager = employees.find(emp => emp.first_name + ' ' + emp.last_name === answers.manager);
                    connection.query('INSERT INTO employee SET ?', {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: selectedRole.id,
                        manager_id: selectedManager ? selectedManager.id : null
                    }, (err, res) => {
                        if (err) throw err;
                        console.log(`Employee added: ${answers.firstName} ${answers.lastName}`);
                        start();
                    });
                });
            });
        });
    }
    
    function updateEmployeeRole() {
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
    
            connection.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;
    
                inquirer.prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        choices: employees.map(emp => emp.first_name + ' ' + emp.last_name),
                        message: 'Which employee\'s role do you want to update?'
                    },
                    {
                        name: 'role',
                        type: 'list',
                        choices: roles.map(role => role.title),
                        message: 'What is the new role?'
                    }
                ]).then(answers => {
                    let selectedEmployee = employees.find(emp => emp.first_name + ' ' + emp.last_name === answers.employee);
                    let selectedRole = roles.find(role => role.title === answers.role);
    
                    connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [selectedRole.id, selectedEmployee.id], (err, res) => {
                        if (err) throw err;
                        console.log(`Updated employee's role: ${answers.employee}`);
                        start();
                    });
                });
            });
        });
    }
    
start();