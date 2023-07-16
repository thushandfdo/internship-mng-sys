// local imports
import { auth } from '../../firebase/firebase.jsx';

const Dashboard = () => {
    return (
        <div>{auth?.currentUser?.email}</div>
    )
};

export default Dashboard;
