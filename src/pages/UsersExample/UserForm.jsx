import { useState } from 'react';

const UserForm = ({ addUser }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addUser({ name, age: Number(age) });
        setName('');
        setAge('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <input type='number' value={age} onChange={(e) => setAge(e.target.value)} />
            <button type='submit'>Add User</button>
        </form>
    );
};

export default UserForm;
