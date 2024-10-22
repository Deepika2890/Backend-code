const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
    // Create categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
    )`);

    // Create transactions table
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
    )`);

    // Insert initial categories
    const categories = [
        { name: 'Salary', type: 'income' },
        { name: 'Freelance', type: 'income' },
        { name: 'Groceries', type: 'expense' },
        { name: 'Utilities', type: 'expense' },
        { name: 'Rent', type: 'expense' }
    ];

    const insertCategory = db.prepare(`INSERT INTO categories (name, type) VALUES (?, ?)`);
    categories.forEach(({ name, type }) => {
        insertCategory.run(name, type);
    });
    insertCategory.finalize();

    // Insert initial transactions
    const transactions = [
        { type: 'income', category: 'Salary', amount: 3000, date: '2023-10-01', description: 'Monthly salary' },
        { type: 'income', category: 'Freelance', amount: 800, date: '2023-10-10', description: 'Freelance project' },
        { type: 'expense', category: 'Groceries', amount: 150, date: '2023-10-05', description: 'Weekly groceries' },
        { type: 'expense', category: 'Utilities', amount: 200, date: '2023-10-15', description: 'Electricity bill' },
        { type: 'expense', category: 'Rent', amount: 1200, date: '2023-10-01', description: 'Monthly rent' }
    ];

    const insertTransaction = db.prepare(`INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`);
    transactions.forEach(({ type, category, amount, date, description }) => {
        insertTransaction.run(type, category, amount, date, description);
    });
    insertTransaction.finalize();
});

module.exports = db;
