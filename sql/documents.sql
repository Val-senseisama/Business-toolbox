CREATE TABLE
    docs_types (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    docs_documents (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        company_id INT UNSIGNED NOT NULL,
        branch_id INT UNSIGNED NOT NULL,
        type_id INT,
        employee_id INT,
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
    docs_access_log (
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