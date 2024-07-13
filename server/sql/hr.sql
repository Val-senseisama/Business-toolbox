CREATE TABLE
    IF NOT EXISTS hr_departments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS hr_job_titles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS hr_salaries (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        net_salary DECIMAL(20, 4) NOT NULL,
        income_tax DECIMAL(20, 4) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
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
        DESCRIPTION TEXT NOT NULL,
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
    IF NOT EXISTS hr_time_off (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM ('APPROVED', 'PENDING', 'REJECTED') NOT NULL,
        comments TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS hr_training (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        course_name VARCHAR(100) NOT NULL,
        completion_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );

CREATE TABLE
    IF NOT EXISTS hr_benefits (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        company_id INT UNSIGNED NOT NULL,
        employee_id INT UNSIGNED NOT NULL,
        type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES accounts (id) ON DELETE RESTRICT
    );