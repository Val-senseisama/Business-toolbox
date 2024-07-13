CREATE TABLE
    IF NOT EXISTS accounts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        details JSON NOT NULL,
        type ENUM (
            'ASSETS',
            'EQUITY',
            'EXPENSE',
            'INCOME',
            'LIABILITIES'
        ) NOT NULL,
        category ENUM ('LEDGER', 'CUSTOMER', 'EMPLOYEE', 'VENDOR') NOT NULL,
        balance DECIMAL(20, 4) default 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS accounting_year (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM ('ACTIVE', 'PENDING', 'CLOSED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS transactions (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        account_id INT UNSIGNED NOT NULL,
        accounting_year_id INT UNSIGNED NOT NULL,
        code VARCHAR(100) NOT NULL,
        amount DECIMAL(20, 2) NOT NULL,
        value_date DATE NOT NULL,
        remarks VARCHAR(255) NOT NULL,
        counterpart VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE,
        FOREIGN KEY (accounting_year_id) REFERENCES accounting_year (id) ON DELETE RESTRICT
    );