import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Timestamp } from 'firebase/firestore'

// material-ui imports
import Typography from "@mui/material/Typography";
import MuiTextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

// local imports
import { DatePicker, Autocomplete, Table, DialogForm, TimePicker } from '../../components';
import { addEvent, checkEvent, getEvents } from '../../utils/eventUtils';
import { getOrgById, getOrgs } from '../../utils/orgUtils';
import { getUserById, getUsersByRole } from '../../utils/userUtils';

const Events = () => {
    const [message, setMessage] = useState('');
    const [events, setEvents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);
    const [isDialogOpened, setIsDialogOpened] = useState(false);

    const types = [
        { key: 'calling', value: 'Calling Interview' },
        { key: 'tech', value: 'Technical Interview' },
        { key: 'hr', value: 'HR Interview' },
        { key: 'exam', value: 'Exam' },
        { key: 'ceo', value: 'CEO Interview' },
    ];

    const statuses = [
        { key: 'ongoing', value: 'Ongoing' },
        { key: 'selected', value: 'Selected' },
        { key: 'rejected', value: 'Rejected' },
        { key: 'notSelected', value: 'Not Selected' },
    ];

    const columns = [
        { id: 'company', label: 'Comapny' },
        { id: 'student', label: 'Student' },
        { id: 'calledDate', label: 'Called Date' },
        { id: 'interviewDate', label: 'Date' },
        { id: 'interviewTime', label: 'Time' },
        { id: 'type', label: 'Type' },
        { id: 'status', label: 'Status' },
    ];

    const initialValues = {
        company: null,
        student: null,
        calledDate: new Date(),
        interviewDate: '',
        interviewTime: '',
        type: '',
        status: statuses[0].key,
    };

    const validationSchema = Yup.object().shape({
        company: Yup.object().nullable().required('Company is Required'),
        student: Yup.object().nullable().required('Student is Required'),
        calledDate: Yup.date().required('Called Date is Required'),
        interviewDate: Yup.date().required('Interview Date is Required'),
        interviewTime: Yup.date().required('Interview Time is Required'),
        type: Yup.string().required('Type is Required'),
        status: Yup.string().required('Status is Required'),
    });

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            const events = await Promise.all(
                data.map(async (event) => {
                    const student = await getUserById(event.student);
                    const company = await getOrgById(event.company);
                    const calledDate = event.calledDateTime.toDate().toLocaleDateString();
                    const interviewDate = event.interviewDateTime.toDate().toLocaleDateString();
                    const interviewTime = event.interviewDateTime.toDate().toLocaleTimeString();
                    const type = types.find((type) => type.key === event.type)?.value;
                    const status = statuses.find((status) => status.key === event.status)?.value;

                    return {
                        company: company?.name,
                        student: student?.firstName + ' ' + student?.lastName,
                        calledDate,
                        interviewDate,
                        interviewTime,
                        type,
                        status,
                    };
                })
            );

            setEvents(events);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCompanies = async () => {
        await getOrgs().then((res) => {
            setCompanies(res)
        }).catch((error) => {
            console.log(error);
        });
    };

    const fetchStudents = async () => {
        await getUsersByRole('all-s').then((res) => {
            setStudents(res)
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        fetchCompanies();
        fetchStudents();
        fetchEvents();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDialogClose = () => {
        setIsDialogOpened(false);
    };

    const handleSave = async (values, onSubmitProps) => {
        try {
            if (!values.company || !values.student || !values.calledDate || !values.interviewDate || !values.interviewTime || !values.type || !values.status) {
                setMessage("Please fill all the fields");
                throw new Error("Please fill all the fields");
            }

            if (await checkEvent(values.company, values.student, values.interviewDateTime)) {
                setMessage("Event already exists");
                throw new Error("Event already exists");
            }

            const interviewDateTime = values.interviewDate;
            interviewDateTime.setHours(values.interviewTime.getHours());
            interviewDateTime.setMinutes(values.interviewTime.getMinutes());

            const event = {
                company: values.company?.id,
                student: values.student?.id,
                calledDateTime: Timestamp.fromDate(values.calledDate), 
                created: Timestamp.fromDate(new Date()),
                interviewDateTime: Timestamp.fromDate(interviewDateTime),
                type: values.type,
                status: values.status,
            };

            const error = await addEvent(event);

            if (error) {
                throw new Error(error);
            }

            setMessage('Successfully added event');
            fetchEvents();

            onSubmitProps.resetForm();
            handleDialogClose();
        } catch (error) {
            setMessage(error.message);
            console.log(error.code || '', error.message || error);
        }
    };

    const newEventForm = (props) => (
        <Form>
            <Autocomplete
                name='company'
                label="Company"
                options={companies}
                optionLabel='name'
                formikProps={props}
            />
            <Autocomplete
                name='student'
                label="Student"
                options={students}
                optionLabel='firstName'
                formikProps={props}
            />

            <DatePicker
                label="Called Date"
                name="calledDate"
                formikProps={props}
            />

            <DatePicker
                label="Interview Date"
                name="interviewDate"
                formikProps={props}
            />

            <TimePicker
                label="Interview Time"
                name="interviewTime"
                formikProps={props}
            />

            <MuiTextField
                select
                fullWidth
                size="small"
                label="Type"
                name="type"
                defaultValue={''}
                onChange={props.handleChange}
                error={props.touched.type && Boolean(props.errors.type)}
                helperText={props.touched.type && props.errors.type}
                sx={{ mb: 2 }}
            >
                {types.map((type) => (
                    <MenuItem key={type.key} value={type.key}>
                        {type.value}
                    </MenuItem>
                ))}
            </MuiTextField>

            <MuiTextField
                select
                fullWidth
                size="small"
                label="Status"
                name="status"
                defaultValue={statuses[0].key}
                onChange={props.handleChange}
                error={props.touched.status && Boolean(props.errors.status)}
                helperText={props.touched.status && props.errors.status}
                disabled={true}
                sx={{ mb: 2 }}
            >
                {statuses.map((status) => (
                    <MenuItem key={status.key} value={status.key}>
                        {status.value}
                    </MenuItem>
                ))}
            </MuiTextField>

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                >
                    Save
                </Button>
                <Button
                    type='reset'
                    fullWidth
                    variant="outlined"
                >
                    Clear
                </Button>
            </Stack>

            {message && <Typography align="center" variant="subtitle2" m={2}>{message}</Typography>}
        </Form>
    );

    return (
        <div style={{ margin: 16 }}>
            <Button variant='contained' onClick={() => setIsDialogOpened(!isDialogOpened)}>Add new Event</Button>

            <DialogForm
                isOpen={isDialogOpened}
                header='Add new Event'
                handleDialogClose={handleDialogClose}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {(props) => newEventForm(props)}
                </Formik>
            </DialogForm>

            <Typography variant="h4" align="center">Events</Typography>
            <Table search='' columns={columns} rows={events} indexing={true} />
        </div>
    )
};

export default Events;
