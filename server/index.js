const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        // Создаем таблицу users при первом запуске
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Table creation error:', err);
            } else {
                console.log('Users table created/checked');
                // Добавляем тестового пользователя
                const password = 'password';
                bcrypt.hash(password, 10, (err, hash) => {
                    db.run(
                        'INSERT OR IGNORE INTO users (login, password_hash, role) VALUES (?, ?, ?)',
                        ['admin', hash, 'admin'],
                        (err) => {
                            if (err) console.error('User creation error:', err);
                            else console.log('Test user created: admin/password');
                        }
                    );
                });
            }
        });
    }
});

const JWT_SECRET = 'secretkey';

// Роут для авторизации
app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;
    console.log('Login attempt:', req.body); // Логируем входящий запрос
    db.get(
        'SELECT * FROM users WHERE login = ?',
        [login],
        async (err, user) => {
            console.log('DB response:', {err, user}); // Логируем ответ БД
            if (err || !user || !(await bcrypt.compare(password, user.password_hash))) {
                console.log('Error or user not found');
                return res.status(401).json({ error: 'Неверные учетные данные' });
            }

            const match = await bcrypt.compare(password, user.password_hash);
            console.log('Password match:', match); // Логируем результат сравнения

            if (!match) {
                console.log('Password mismatch');
                return res.status(401).json(/* ... */);
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.json({ token });
        }
    );
});

// Роут для регистрации
app.post('/api/register', async (req, res) => {
    const { login, password, role } = req.body;

    // Проверка допустимых ролей
    const allowedRoles = ['lawyer'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Недопустимая роль' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (login, password_hash, role) 
            VALUES (?, ?, ?)`,
            [login, hashedPassword, role],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Пользователь уже существует' });
                    }
                    throw err;
                }
                res.json({ success: true });
            }
        );
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Защищенный роут для примера
app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json(decoded);
    } catch (err) {
        res.status(400).send('Invalid token');
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));