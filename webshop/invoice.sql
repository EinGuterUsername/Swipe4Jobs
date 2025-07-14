-- Erstellen der Datenbank
CREATE DATABASE IF NOT EXISTS invoice_db;
USE invoice_db;

-- Tabelle für Rechnungen
CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL,   -- BT-1
    invoice_date DATE NOT NULL,            -- BT-2
    invoice_type_code VARCHAR(10),         -- BT-3
    currency_code VARCHAR(3),              -- BT-5
    vat_currency_code VARCHAR(3),          -- BT-6
    tax_due_date DATE,                     -- BT-7
    payment_due_date DATE,                 -- BT-9
    project_reference VARCHAR(255),        -- BT-11
    contract_reference VARCHAR(255),       -- BT-12
    order_reference VARCHAR(255),          -- BT-13
    delivery_note_reference VARCHAR(255),  -- BT-15
    payment_terms TEXT,                    -- BT-20
    total_net_amount DECIMAL(15,2),        -- BT-106
    total_vat_amount DECIMAL(15,2),        -- BT-110
    total_gross_amount DECIMAL(15,2),      -- BT-112
    paid_amount DECIMAL(15,2),             -- BT-113
    rounding_amount DECIMAL(15,2),         -- BT-114
    due_payment_amount DECIMAL(15,2)       -- BT-115
);

-- Tabelle für Lieferanten (Suppliers)
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,           -- BT-27
    supplier_trade_name VARCHAR(255),              -- BT-28
    supplier_vat_id VARCHAR(50),                   -- BT-31
    supplier_address_line1 VARCHAR(255),           -- BT-35
    supplier_address_line2 VARCHAR(255),           -- BT-36
    supplier_city VARCHAR(100),                    -- BT-37
    supplier_postal_code VARCHAR(20),              -- BT-38
    supplier_region VARCHAR(100),                  -- BT-39
    supplier_country_code VARCHAR(3),              -- BT-40
    supplier_contact_name VARCHAR(255),            -- BT-41
    supplier_contact_phone VARCHAR(20),            -- BT-42
    supplier_contact_email VARCHAR(255)            -- BT-43
);

-- Tabelle für Erwerber (Buyers)
CREATE TABLE buyers (
    buyer_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_name VARCHAR(255) NOT NULL,              -- BT-44
    buyer_trade_name VARCHAR(255),                 -- BT-45
    buyer_vat_id VARCHAR(50),                      -- BT-48
    buyer_address_line1 VARCHAR(255),              -- BT-50
    buyer_address_line2 VARCHAR(255),              -- BT-51
    buyer_city VARCHAR(100),                       -- BT-52
    buyer_postal_code VARCHAR(20),                 -- BT-53
    buyer_region VARCHAR(100),                     -- BT-54
    buyer_country_code VARCHAR(3),                 -- BT-55
    buyer_contact_name VARCHAR(255),               -- BT-56
    buyer_contact_phone VARCHAR(20),               -- BT-57
    buyer_contact_email VARCHAR(255)               -- BT-58
);

-- Tabelle für Rechnungspositionen (Invoice Line Items)
CREATE TABLE invoice_line_items (
    line_item_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,                                -- Referenz auf die Rechnung
    item_description TEXT,                         -- BT-154
    item_quantity DECIMAL(15,3),                   -- BT-129
    item_unit_price DECIMAL(15,2),                 -- BT-146
    item_total DECIMAL(15,2),                      -- BT-131
    item_tax_rate DECIMAL(5,2),                    -- BT-152
    item_tax_amount DECIMAL(15,2),                 -- BT-117
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

-- Tabelle für Zahlungsdetails (Payment Details)
CREATE TABLE payment_details (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,                                -- Referenz auf die Rechnung
    payment_method_code VARCHAR(10),               -- BT-81
    payment_reference VARCHAR(255),                -- BT-83
    bank_account_id VARCHAR(50),                   -- BT-84
    bank_account_name VARCHAR(255),                -- BT-85
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

-- Tabelle für Umsatzsteuerinformationen (Tax Details)
CREATE TABLE tax_details (
    tax_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,                                -- Referenz auf die Rechnung
    tax_base_amount DECIMAL(15,2),                 -- BT-116
    tax_total_amount DECIMAL(15,2),                -- BT-110
    tax_rate DECIMAL(5,2),                         -- BT-119
    tax_category_code VARCHAR(10),                 -- BT-118
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

-- Tabelle für Nachlässe (Discounts)
CREATE TABLE discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,                                -- Referenz auf die Rechnung
    discount_amount DECIMAL(15,2),                 -- BT-92
    discount_reason TEXT,                          -- BT-97
    discount_percentage DECIMAL(5,2),              -- BT-94
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

-- Tabelle für Zuschläge (Charges)
CREATE TABLE charges (
    charge_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,                                -- Referenz auf die Rechnung
    charge_amount DECIMAL(15,2),                   -- BT-99
    charge_reason TEXT,                            -- BT-104
    charge_percentage DECIMAL(5,2),                -- BT-101
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);
