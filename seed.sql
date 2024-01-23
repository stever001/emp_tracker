INSERT INTO department (name) VALUES ('Engineering'), ('HR'), ('Sales');

INSERT INTO role (title, salary, department_id) VALUES 
('Engineer', 70000, 1),
('HR Manager', 65000, 2),
('Sales Representative', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Scott', 'Farkus', 1, NULL),
('Jane', 'Wyman', 2, NULL),
('Emily', 'Parsnip', 3, 1);