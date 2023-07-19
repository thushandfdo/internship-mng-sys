import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui imports
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// local imports
import { auth } from "../../firebase/firebase";
import { addUser, checkUser } from "../../utils/userUtils";
import { TextField } from "../../components";

const SignUp = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const initialValues = {
        regNo: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        regNo: Yup.string().required('Registration No is Required'),
        firstName: Yup.string().required('First Name is Required'),
        lastName: Yup.string().required('Last Name is Required'),
        email: Yup.string().email('Invalid Email').required('Email is Required'),
        password: Yup.string().required('Password is Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is Required')
    });

    const handleSignUp = async (values, _onSubmitProps_) => {
        try {
            if (!values.regNo || !values.firstName || !values.lastName || !values.email || !values.password || !values.confirmPassword) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            if (await checkUser(values.regNo, values.email)) {
                setMessage("User already exists");
                throw new Error("User already exists");
            }

            await addUser({
                regNo: values.regNo,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email
            });

            setMessage("Logged in successfully");
            navigate('/dashboard');
        } catch (error) {
            console.log(error.code || '', error.message || error);
        }
    };

    const handleLogout = () => {
        try {
            signOut(auth);
            setMessage("Logged out successfully");
        } catch (error) {
            console.log(error);
        }
    };

    const signUpForm = (props) => (
        <Form>
            <Typography variant="h4" align="center" mb={2}>Sign-up</Typography>
            <TextField
                autoFocus={true}
                name='regNo'
                label="Registration Number"
                formikProps={props}
                textTransform='uppercase'
            />
            <TextField
                name='firstName'
                label="First Name"
                formikProps={props}
            />
            <TextField
                name='lastName'
                label="Last Name"
                formikProps={props}
            />
            <TextField
                name='email'
                label="Email"
                type="email"
                formikProps={props}
            />
            <TextField
                name='password'
                label="Password"
                type="password"
                formikProps={props}
            />
            <TextField
                name='confirmPassword'
                label="Confirm Password"
                type="password"
                formikProps={props}
            />

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                >
                    Sign-up
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Stack>

            {message && <Typography align="center" variant="subtitle2" m={2}>{message}</Typography>}
        </Form>
    );

    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <div width="50%" style={{ margin: '0 auto', maxWidth: 400 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSignUp}
                >
                    {(props) => signUpForm(props)}
                </Formik>
            </div>
        </div>
    )
};

export default SignUp;
