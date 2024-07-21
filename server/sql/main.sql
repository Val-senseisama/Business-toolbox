CREATE TABLE
    IF NOT EXISTS roles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        json JSON,
        status ENUM ('ACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS companies (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        about TEXT NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) DEFAULT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        website VARCHAR(100) DEFAULT NULL,
        industry VARCHAR(50) DEFAULT NULL,
        logo VARCHAR(100) DEFAULT NULL,
        settings JSON DEFAULT NULL,
        plan VARCHAR(100) DEFAULT 'FREE',
        plan_expiry DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS branches (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        settings JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        refresh_secret VARCHAR(100) DEFAULT NULL,
        title VARCHAR(50) DEFAULT NULL,
        firstname VARCHAR(50) DEFAULT NULL,
        lastname VARCHAR(50) DEFAULT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        gender ENUM ('Male', 'Female') DEFAULT NULL,
        status ENUM ('ACTIVE', 'PENDING', 'BANNED') DEFAULT 'PENDING',
        date_of_birth DATE DEFAULT NULL,
        day_of_birth INT (3) DEFAULT 0,
        settings JSON DEFAULT NULL,
        data JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS user_company (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        role_id INT UNSIGNED DEFAULT 0,
        email VARCHAR(100) NOT NULL,
        role_type ENUM ('OWNER', 'STAFF', 'CUSTOMER'),
        limit_to_customers JSON DEFAULT NULL,
        limit_to_branches JSON DEFAULT NULL,
        status ENUM ('ACTIVE', 'PENDING', 'REJECTED') DEFAULT 'PENDING',
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS audit_trail (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        name VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45) DEFAULT NULL,
        browser_agents TEXT DEFAULT NULL,
        task VARCHAR(100) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS email_messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED DEFAULT 0,
        destination VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        status ENUM ('SENT', 'PENDING', 'FAILED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS tokens (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        status ENUM ('USED', 'PENDING') DEFAULT 'PENDING',
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS logs (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

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
        salaries_expenses_posted INT (1) DEFAULT 0,
        loan_liabilities_posted INT (1) DEFAULT 0,
        loan_expenses_posted INT (1) DEFAULT 0,
        penalties_liabilities_posted INT (1) DEFAULT 0,
        penalties_expenses_posted INT (1) DEFAULT 0,
        union_dues_liabilities_posted INT (1) DEFAULT 0,
        union_dues_expenses_posted INT (1) DEFAULT 0,
        health_liabilities_posted INT (1) DEFAULT 0,
        health_expenses_posted INT (1) DEFAULT 0,
        retirements_liabilities_posted INT (1) DEFAULT 0,
        retirements_expenses_posted INT (1) DEFAULT 0,
        other_deductions_liabilities_posted INT (1) DEFAULT 0,
        other_deductions_expenses_posted INT (1) DEFAULT 0,
        tax_liabilities_posted INT (1) DEFAULT 0,
        tax_expenses_posted INT (1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS hr_departments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS hr_job_titles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS hr_qualifications (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        type ENUM (
            'EXPERIENCE',
            'EDUCATION',
            'CERTIFICATION',
            'OTHERS'
        ) NOT NULL,
        description TEXT NOT NULL,
        date_obtained DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS hr_performance_reviews (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        reviewer_id INT UNSIGNED NOT NULL,
        review_date DATE NOT NULL,
        rating INT UNSIGNED NOT NULL,
        comments TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT,
        FOREIGN KEY (reviewer_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS hr_attendance (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        attendance_date DATE NOT NULL,
        check_in VARCHAR(5) NOT NULL,
        check_out VARCHAR(5) DEFAULT NULL,
        created_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS fixed_asset_categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        depreciation_method ENUM (
            'STRAIGHT-LINE',
            'DECLINING-BALANCE',
            'SUM-OF-YEARS-DIGITS',
            'UNITS-OF-PRODUCTION'
        ) DEFAULT 'STRAIGHT-LINE',
        useful_life_years INT UNSIGNED NOT NULL,
        salvage_value DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS fixed_assets_items (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        vendor_id INT UNSIGNED NOT NULL,
        location_id INT UNSIGNED NOT NULL,
        category_id INT UNSIGNED NOT NULL,
        tag VARCHAR(50) UNIQUE,
        serial_number VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        purchase_date DATE NOT NULL,
        purchase_cost DECIMAL(20, 4) NOT NULL,
        latest_value DECIMAL(20, 4) NOT NULL,
        status ENUM (
            'ACTIVE',
            'INACTIVE',
            'DAMAGED',
            'MAINTENANCE',
            'DISPOSED'
        ) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES accounts (id),
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES hr_departments (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES fixed_asset_categories (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS fixed_assets_depreciation (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        item_id INT UNSIGNED NOT NULL,
        tx_code VARCHAR(100) NOT NULL,
        depreciation_method ENUM (
            'STRAIGHT-LINE',
            'DECLINING-BALANCE',
            'SUM-OF-YEARS-DIGITS',
            'UNITS-OF-PRODUCTION'
        ) DEFAULT 'STRAIGHT-LINE',
        depreciation_amount DECIMAL(20, 4) NOT NULL,
        depreciation_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES fixed_assets_items (id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS docs_types (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS docs_documents (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        type_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        version INT UNSIGNED DEFAULT 1,
        FOREIGN KEY (type_id) REFERENCES docs_types (id) ON DELETE RESTRICT,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS docs_access_log (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        document_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        access_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        action VARCHAR(50),
        FOREIGN KEY (document_id) REFERENCES docs_documents (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE
    );