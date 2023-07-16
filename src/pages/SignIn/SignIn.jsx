import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";

// material-ui imports
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// local imports
import { auth } from '../../firebase/firebase.jsx';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

            console.log(user.email);

            setError('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleSignIn}>
                Sign In
            </Button>
            {error && <Typography>{error}</Typography>}
        </div>
    );
};

export default SignIn;
