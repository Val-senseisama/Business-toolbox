CREATE TABLE
    IF NOT EXISTS payrolls (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(255) NOT NULL,
        schedule TEXT NOT NULL,
        salaries_total DECIMAL(20, 4) NOT NULL,
        tax_total DECIMAL(20, 4) DEFAULT 0.00,
        salaries_liabilities_posted INT (1) DEFAULT 0,
        tax_liabilities_posted INT (1) DEFAULT 0,
        salaries_expenses_posted INT (1) DEFAULT 0,
        tax_expenses_posted INT (1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE
    );