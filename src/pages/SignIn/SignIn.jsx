import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// material-ui imports
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// local imports
import { auth } from '../../firebase/firebase.jsx';
import { TextField } from '../../components';

const SignIn = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState('');

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is Required'),
        password: Yup.string().required('Password is Required')
    });

    const handleSignIn = async (values, _onSubmitProps_) => {
        try {
            if(!values.email || !values.password) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            await signInWithEmailAndPassword(auth, values.email, values.password)

            setMessage('');
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <div width="50%" style={{ margin: '0 auto', maxWidth: 400 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSignIn}
                >
                    {(props) => (
                        <Form>
                            <Typography variant="h4" align="center" mb={2}>
                                Sign In
                            </Typography>

                            <TextField
                                autoFocus={true}
                                name="email"
                                label="Email"
                                type="email"
                                formikProps={props}
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                formikProps={props}
                            />

                            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    type="reset"
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => console.log(auth?.currentUser?.email)}
                                >
                                    Clear
                                </Button>
                            </Stack>

                            {message && <Typography align="center" variant="subtitle2" m={2}>{message}</Typography>}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignIn;
