import { useState, useEffect } from 'react';

// local imports
import { auth } from '../../firebase/firebase.jsx';
import { getUser } from '../../utils/userUtils.jsx';

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = async (email) => {
            if (email) {
                const loggedUser = await getUser(email);
                setCurrentUser(loggedUser);
            }
        };

        getCurrentUser(auth.currentUser?.email);
    }, []);

    return (
        <div>{JSON.stringify(currentUser) || ''}</div>
    )
};

export default Dashboard;
