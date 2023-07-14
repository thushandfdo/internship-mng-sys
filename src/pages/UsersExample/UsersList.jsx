import User from './User.jsx';

const UserList = (props) => {
    const { users, updateUser, deleteUser } = props;

    return (
        <div>
            {users.map((user, index) => (
                <User 
                    key={index} 
                    user={user} 
                    updateUser={updateUser} 
                    deleteUser={deleteUser} 
                />
            ))}
        </div>
    );
};

export default UserList;