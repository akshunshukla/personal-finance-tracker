-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'user', 'read-only')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, type) VALUES
-- Expense
('Food', 'expense'),
('Transport', 'expense'),
('Rent', 'expense'),
('Utilities', 'expense'),
('Groceries', 'expense'),
('Entertainment', 'expense'),
('Health', 'expense'),
('Education', 'expense'),
('Shopping', 'expense'),
('Travel', 'expense'),
('Insurance', 'expense'),
('Miscellaneous', 'expense'),

-- Income
('Salary', 'income'),
('Freelance', 'income'),
('Business', 'income'),
('Investments', 'income'),
('Gifts', 'income'),
('Other', 'income')

ON CONFLICT (name) DO NOTHING;


CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);