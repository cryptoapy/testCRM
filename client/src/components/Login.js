import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });

            if (!response.ok) throw new Error('Authorization failed');

            const { token } = await response.json();
            onLogin(token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Логин:</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit">Войти</button>
            </form>

            <div className="register-link">
                Нет аккаунта?
                <button type="button" onClick={() => navigate('/register')}>
                    Зарегистрироваться
                </button>
            </div>
        </div>
    );
};

export default Login;