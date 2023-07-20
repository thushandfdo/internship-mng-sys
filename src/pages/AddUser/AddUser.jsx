import { useEffect, useState } from 'react';
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
import { addUser, checkUser, getUsers } from '../../utils/userUtils';

const AddUser = () => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);

    const roles = [
        { key: 'student', value: 'Student'},
        { key: 'rep', value: 'Representative' },
        { key: 'admin', value: 'Admin' },
        { key: 'superAdmin', value: 'Super Admin' }
    ];

    const columns = [
        { id: 'regNo', label: 'Reg. No' },
        { id: 'firstName', label: 'First Name' },
        { id: 'lastName', label: 'Last Name' },
        { id: 'email', label: 'Email' },
        { id: 'role', label: 'Role' }
    ];

    const initialValues = {
        email: '',
        password: '',
        role: roles[1].key ?? '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is Required'),
        password: Yup.string().required('Password is Required'),
        role: Yup.string().required('Role is Required'),
    });

    const fetchUsers = async () => {
        await getUsers().then((data) => {
            const users = data.map((user) => {
                return {
                    ...user,
                    role: roles.filter((role) => role.key === user.role)[0]?.value
                }
            });

            setUsers(users);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (values, _onSubmitProps_) => {
        try {
            if (!values.email || !values.role) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            if (await checkUser('', values.email)) {
                setMessage("User already exists");
                throw new Error("User already exists");
            }

            const user = {
                email: values.email,
                role: values.role,
            };

            await addUser(user, values.password);

            setMessage('Successfully added user');
            fetchUsers();
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
                                name='password'
                                label="Password"
                                type="password"
                                formikProps={props}
                            />
                            <MuiTextField
                                select
                                fullWidth
                                size="small"
                                label="Role"
                                name="role"
                                defaultValue={''}
                                onChange={props.handleChange}
                                sx={{ mb: 2 }}
                            >
                                {roles.filter((role) => role.key !== 'student').map((role) => (
                                    <MenuItem key={role.key} value={role.key}>
                                        {role.value}
                                    </MenuItem>
                                ))}
                            </MuiTextField>

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
            <div style={{ margin: '0 auto' }}>
                <Typography variant="h4" align="center" sx={{ mb: 2 }}>Users</Typography>
                <Table search="" columns={columns} rows={users} />
            </div>
        </div>
    )
};

export default AddUser;
