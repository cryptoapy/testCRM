import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('lawyer');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password, role })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Registration failed');

            setSuccess('Регистрация успешна! Теперь вы можете войти');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="register-container">
            <h2>Регистрация (Юрист)</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Логин:</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Подтвердите пароль:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Роль:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled
                    >
                        <option value="lawyer">Юрист</option>
                    </select>
                </div>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <button type="submit">Зарегистрироваться</button>
            </form>
            <div className="login-link">
                Уже есть аккаунт?
                <button type="button" onClick={() => navigate('/login')}>
                    Войти
                </button>
            </div>
        </div>
    );
};

export default Register;