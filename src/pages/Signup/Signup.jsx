import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui imports
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// local imports
import { auth } from "../../firebase/firebase";
import { addUser, checkUser } from "../../utils/userUtils";

const SignUp = () => {
    const [regNo, setRegNo] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleClear = () => {
        setRegNo("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const initialValues = {
        username: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is Required'),
        password: Yup.string().required('Password is Required')
    });

    const handleSubmit = (values, onSubmitProps) => {
        store.dispatch(logOut());

        const data = { username: values.username, password: values.password };
        store.dispatch(logIn(data));

        onSubmitProps.resetForm();

        const unsubscribe = store.subscribe(() => {
            const token = store.getState().login.token;

            if (token !== null) {
                navigate('/dashboard');
                unsubscribe();
            } else {
                setIsAlertOpened(true);
            }
        });
    };

    const handleSignUp = async () => {
        try {
            if (password !== confirmPassword) {
                setMessage("Passwords do not match");
                throw new Error("Passwords do not match");
            }
            
            if (await checkUser(regNo, email)) {
                setMessage("User already exists");
                throw new Error("User already exists");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;

            await addUser({ regNo, firstName, lastName, email: user.email });

            setMessage("Logged in successfully");
            handleClear();
        } catch (error) {
            console.log(error.code || '', error.message || error);
        }
    };

    const handleLogout = () => {
        try {
            handleClear();
            signOut(auth);
            setMessage("Logged out successfully");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <Stack direction="column" rowGap={2} width="50%" margin={"0 auto"} maxWidth={400}>
                <Typography variant="h5" align="center">Sign-up</Typography>
                <TextField
                    autoFocus
                    required
                    size="small"
                    label="Registration Number"
                    variant="outlined"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    inputProps={{
                        style: { textTransform: 'uppercase' },
                    }}
                />
                <TextField
                    required
                    size="small"
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    required
                    size="small"
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    required
                    size="small"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    required
                    size="small"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    required
                    size="small"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleSignUp}
                >
                    Sign-up
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleLogout}
                >
                    Logout
                </Button>

                {message && <Typography align="center" variant="subtitle2">{message}</Typography>}
            </Stack>
        </div>
    )
};

export default SignUp;
