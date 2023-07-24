import { useState } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// material-ui imports
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// local imports
import { addOrg ,checkOrg } from "../../utils/orgUtils";
import { TextField } from '../../components'

const AddOrganization = () => {
    const initialValues = {
        name: '',
        groupLink: '',
        round:'',
    }
    const [message, setMessage] = useState("");

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is Required'),
        groupLink: Yup.string().required('Group Link is Required'),
        round: Yup.string().required('Round is Required'),
    });

    const handleRegister = async (values, _onSubmitProps_) => {
        try {
            if (!values.name || !values.groupLink || !values.round) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            if (await checkOrg(values.name)) {
                setMessage("Organization already exists");
                throw new Error("Organization already exists");
            }

            const organization = {
                name: values.name.toUpperCase(),
                groupLink: values.groupLink,
                round: values.round
            };

            await addOrg(organization);
            setMessage('Successfully added organization');
            _onSubmitProps_.resetForm();
        } catch (error) {
            setMessage(error.message);
            console.log(error.code || '', error.message || error);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <Stack direction="column" rowGap={2} width="50%" margin={"0 auto"} maxWidth={400}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
                >
                    {(props) => (
                        <Form>
                            <Typography variant="h4" align="center" mb={2}>
                                Add New Organization
                            </Typography>
                            <TextField
                                name="name"
                                label="Name"
                                type="text"
                                formikProps={props}
                            />
                            <TextField
                                name="groupLink"
                                label="Group Link"
                                type="text"
                                formikProps={props}
                            />
                            <TextField
                                name="round"
                                label="Round"
                                type="number"
                                formikProps={props}
                            />
                             <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                >
                                    Add Organization
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
            </Stack>
        </div>
    )
};

export default AddOrganization;
