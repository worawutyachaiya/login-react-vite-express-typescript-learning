import mysql from "mysql2/promise";
import { dbConfig } from "./config/db";

const initEmployeeDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``,
    );
    console.log(`Database ${dbConfig.database} ready.`);
    await connection.end();

    const db = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    // Create users table first (if not exists)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.query(createUsersTable);
    console.log("Users table created.");

    // Create departments table
    const createDepartmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.query(createDepartmentsTable);
    console.log("Departments table created.");

    // Create positions table
    const createPositionsTable = `
      CREATE TABLE IF NOT EXISTS positions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await db.query(createPositionsTable);
    console.log("Positions table created.");

    // Add columns to users table if not exist
    const alterUsersTable = async () => {
      const columns = [
        { name: "employee_id", sql: "VARCHAR(20) UNIQUE AFTER id" },
        { name: "first_name", sql: "VARCHAR(50) AFTER username" },
        { name: "last_name", sql: "VARCHAR(50) AFTER first_name" },
        { name: "phone", sql: "VARCHAR(20) AFTER email" },
        { name: "department_id", sql: "INT AFTER phone" },
        { name: "position_id", sql: "INT AFTER department_id" },
        {
          name: "role",
          sql: "ENUM('ADMIN', 'HR', 'EMPLOYEE') DEFAULT 'EMPLOYEE' AFTER position_id",
        },
        {
          name: "status",
          sql: "ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE' AFTER role",
        },
        { name: "hire_date", sql: "DATE AFTER status" },
      ];

      for (const col of columns) {
        try {
          await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.sql}`);
          console.log(`Added column: ${col.name}`);
        } catch (err: any) {
          if (err.code === "ER_DUP_FIELDNAME") {
            console.log(`Column ${col.name} already exists.`);
          } else {
            throw err;
          }
        }
      }

      // Add foreign keys
      try {
        await db.query(`
          ALTER TABLE users 
          ADD CONSTRAINT fk_users_department 
          FOREIGN KEY (department_id) REFERENCES departments(id)
        `);
        console.log("Added foreign key: department_id");
      } catch (err: any) {
        if (err.code === "ER_DUP_KEYNAME" || err.code === "ER_FK_DUP_NAME") {
          console.log("Foreign key fk_users_department already exists.");
        }
      }

      try {
        await db.query(`
          ALTER TABLE users 
          ADD CONSTRAINT fk_users_position 
          FOREIGN KEY (position_id) REFERENCES positions(id)
        `);
        console.log("Added foreign key: position_id");
      } catch (err: any) {
        if (err.code === "ER_DUP_KEYNAME" || err.code === "ER_FK_DUP_NAME") {
          console.log("Foreign key fk_users_position already exists.");
        }
      }
    };

    await alterUsersTable();

    // Insert default data
    const insertDefaults = async () => {
      const [deptRows] = await db.query(
        "SELECT COUNT(*) as count FROM departments",
      );
      if ((deptRows as any)[0].count === 0) {
        await db.query(`
          INSERT INTO departments (name, description) VALUES
          ('IT', 'Information Technology'),
          ('HR', 'Human Resources'),
          ('Finance', 'Finance and Accounting'),
          ('Marketing', 'Marketing and Sales'),
          ('Operations', 'Operations and Logistics')
        `);
        console.log("Default departments inserted.");
      }

      const [posRows] = await db.query(
        "SELECT COUNT(*) as count FROM positions",
      );
      if ((posRows as any)[0].count === 0) {
        await db.query(`
          INSERT INTO positions (name, description) VALUES
          ('Software Engineer', 'Develops and maintains software applications'),
          ('HR Manager', 'Manages human resources operations'),
          ('Accountant', 'Handles financial records and reporting'),
          ('Marketing Specialist', 'Plans and executes marketing campaigns'),
          ('Operations Manager', 'Oversees daily operations')
        `);
        console.log("Default positions inserted.");
      }
    };

    await insertDefaults();

    // Update existing users to ADMIN role (for development)
    await db.query(
      "UPDATE users SET role = 'ADMIN' WHERE role IS NULL OR role = 'EMPLOYEE'",
    );
    console.log("Existing users updated to ADMIN role.");

    await db.end();
    console.log("Employee database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing employee database:", error);
    process.exit(1);
  }
};

initEmployeeDb();
