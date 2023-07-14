const User = (props) => {
    const { user, updateUser, deleteUser } = props;
    
    const handleUpdate = () => {
        updateUser(user.id, user);
    };

    const handleDelete = () => {
        deleteUser(user.id);
    };

    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.age}</p>
            <button onClick={handleUpdate}>Age++</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default User;
