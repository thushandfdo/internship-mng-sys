import { useState } from 'react';

// material-ui imports
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// local imports
import { auth } from './firebase';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
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
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignIn;
