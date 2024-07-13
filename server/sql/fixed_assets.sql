CREATE TABLE
    fixed_asset_categories (
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
        FOREIGN KEY (vendor_id) REFERENCES accounts (id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches (id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES hr_departments (id) ON DELETE SET NULL,
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