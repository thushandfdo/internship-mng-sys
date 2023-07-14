import { useEffect, useState } from 'react';

// local imports
import UserList from './UsersList.jsx';
import UserForm from './UserForm.jsx';
import { getUsers, addUser, updateUser, deleteUser } from '../../utils/userUtils.jsx';

const UsersExample = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const usersData = await getUsers();
        setUsers(usersData);
    };

    const handleAddUser = async (user) => {
        await addUser(user);
        fetchUsers();
    };

    const handleUpdateUser = async (id, user) => {
        await updateUser(id, user);
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <div className='user-example'>
            <UserForm addUser={handleAddUser} />
            <UserList 
                users={users} 
                updateUser={handleUpdateUser} 
                deleteUser={handleDeleteUser} 
            />
        </div>
    )
};

export default UsersExample;
