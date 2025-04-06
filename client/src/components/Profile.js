import React, { useEffect, useState } from 'react';

const Profile = ({ token }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('http://localhost:5000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        };

        fetchProfile();
    }, [token]);

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="profile">
            <h2>Профиль</h2>
            <p>Роль: {userData.role === 'admin' ? 'Главный Юрист' : 'Юрист'}</p>
        </div>
    );
};

export default Profile;