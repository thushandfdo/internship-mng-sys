import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui imports
import Typography from "@mui/material/Typography";
import MuiTextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

// local imports
import { TextField, Table } from '../../components';
import { addUser, checkUser } from '../../utils/userUtils';

const AddUser = () => {
    const [message, setMessage] = useState('');

    const roles = [
        { key: 'student', value: 'Student' },
        { key: 'rep', value: 'Representative' },
        { key: 'admin', value: 'Admin' },
        { key: 'superAdmin', value: 'Super Admin' }
    ];

    const initialValues = {
        regNo: '',
        email: '',
        role: roles[0].key,
        password: ''
    };

    const validationSchema = Yup.object().shape({
        regNo: Yup.string().required('Registration No is Required'),
        email: Yup.string().email('Invalid Email').required('Email is Required'),
        role: Yup.string().required('Role is Required'),
        password: Yup.string().required('Password is Required')
    });

    const handleSave = async (values, _onSubmitProps_) => {
        try {
            if (!values.email || !values.regNo || !values.role) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            if (await checkUser(values.regNo, values.email)) {
                setMessage("User already exists");
                throw new Error("User already exists");
            }

            const user = {
                regNo: values.regNo,
                email: values.email,
                role: values.role,
                password: values.password
            };

            await addUser(user);

            setMessage('Successfully added user');
        } catch (error) {
            setMessage(error.message);
            console.log(error.code || '', error.message || error);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <div width="45%" style={{ margin: '0 auto', maxWidth: 400 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {(props) => (
                        <Form>
                            <Typography variant="h4" align="center" mb={2}>
                                Add New User
                            </Typography>

                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                formikProps={props}
                            />
                            <TextField
                                name="regNo"
                                label="Registration No"
                                textTransform="uppercase"
                                formikProps={props}
                            />
                            <MuiTextField
                                select
                                fullWidth
                                size="small"
                                label="Role"
                                name="role"
                                defaultValue={roles[0].key}
                                onChange={props.handleChange}
                                sx={{ mb: 2 }}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.key} value={role.key}>
                                        {role.value}
                                    </MenuItem>
                                ))}
                            </MuiTextField>
                            <TextField
                                name='password'
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
                                    Add User
                                </Button>
                                <Button
                                    type="reset"
                                    fullWidth
                                    variant="outlined"
                                >
                                    Clear
                                </Button>
                            </Stack>

                            {message && <Typography align="center" variant="subtitle2" m={2}>{message}</Typography>}
                        </Form>
                    )}
                </Formik>
            </div>
            <div width="45%" style={{ margin: '0 auto', maxWidth: 400 }}>
                <Typography variant="h5" align="center">Users</Typography>
                <Table search="" columns={columns} rows={orgList} />
            </div>
        </div>
    )
};

export default AddUser;
