// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import { getUsers, createUser } from '../services/userService';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateUser = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert("All fields are required!");
            return;
        }

        try {
            const res = await createUser(formData);
            console.log("Created user:", res.data);
            setUsers(prevUsers => [...prevUsers, res.data]);
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            console.error('Error creating user:', err);
        }
    };

    return (
        <div className="users-container p-4">
            <h1 className="text-xl font-bold mb-4">Users</h1>

            <div className="user-form mb-6">
                <h2 className="text-lg font-semibold">Add New User</h2>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border p-1"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border p-1"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="border p-1"
                    />
                </div>
                <button onClick={handleCreateUser} className="bg-blue-500 text-white px-3 py-1 mt-2">Add</button>
            </div>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="users-table border w-full">
                    <thead>
                    <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="border px-2 py-1">{user.id}</td>
                            <td className="border px-2 py-1">{user.name}</td>
                            <td className="border px-2 py-1">{user.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
