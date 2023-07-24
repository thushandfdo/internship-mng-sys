import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
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
import { addEvent, checkEvent, deleteEvent, getEvents, updateEvent, validateBeforeInsert, validateBeforeUpdate } from '../../utils/eventUtils';
import { getOrgById, getOrgs } from '../../utils/orgUtils';
import { getUserById, getUsersByRole } from '../../utils/userUtils';

const Events = () => {
    const [message, setMessage] = useState('');
    const [events, setEvents] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [students, setStudents] = useState([]);

    const [isDialogOpened, setIsDialogOpened] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingEventId, setUpdatingEventId] = useState('');

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
                        ...event,
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
        setIsUpdating(false);
        formik.resetForm();
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

            await validateBeforeInsert(event);

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
            console.error(error.code || '', error.message || error);
        }
    };

    const handleUpdate = async (values, _onSubmitProps_) => {
        try {
            const event = {
                id: updatingEventId,
                company: values.company?.id,
                student: values.student?.id,
                calledDateTime: Timestamp.fromDate(values.calledDate),
                interviewDateTime: Timestamp.fromDate(values.interviewDate),
                type: values.type,
                status: values.status,
            };

            await validateBeforeUpdate(event);

            const error = await updateEvent(updatingEventId, event);

            if (error) {
                throw new Error(error);
            }

            setMessage('Successfully updated event');
            fetchEvents();
            handleDialogClose();
        }
        catch (error) {
            setMessage(error.message);
            console.error(error.code || '', error.message || error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: isUpdating ? handleUpdate : handleSave,
    });

    const setToEdit = (row) => {
        setUpdatingEventId(row.id);

        formik.setValues({
            company: companies.filter((company) => company.name === row.company)[0],
            student: students.filter((student) => (student.firstName + ' ' + student.lastName) === row.student)[0],
            calledDate: new Date(row.calledDate),
            interviewDate: new Date(row.interviewDate),
            interviewTime: new Date(`1970-01-01 ${row.interviewTime}`),
            type: types.filter((type) => type.value === row.type)[0]?.key,
            status: statuses.filter((status) => status.value === row.status)[0]?.key,
        });

        setIsDialogOpened(true);
        setIsUpdating(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteEvent(id);
        }
        catch (error) {
            setMessage(error.message);
            console.log(error.code || '', error.message || error);
        }
    };

    const newEventForm = () => (
        <div>
            <Autocomplete
                name='company'
                label="Company"
                options={companies}
                optionLabel='name'
                formikProps={formik}
            />
            <Autocomplete
                name='student'
                label="Student"
                options={students}
                optionLabel='firstName'
                formikProps={formik}
            />

            <DatePicker
                label="Called Date"
                name="calledDate"
                formikProps={formik}
            />

            <DatePicker
                label="Interview Date"
                name="interviewDate"
                formikProps={formik}
            />

            <TimePicker
                label="Interview Time"
                name="interviewTime"
                formikProps={formik}
            />

            <MuiTextField
                select
                fullWidth
                size="small"
                label="Type"
                name="type"
                defaultValue={''}
                value={formik.values.type ?? ''}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
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
                defaultValue={formik.values.status ?? ''}
                value={formik.values.status ?? ''}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                disabled={!isUpdating}
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
                    onClick={formik.handleSubmit}
                >
                    {isUpdating ? 'Update' : 'Save'}
                </Button>
                <Button
                    type='reset'
                    fullWidth
                    variant="outlined"
                    onClick={formik.resetForm}
                >
                    Clear
                </Button>
            </Stack>

            {message && <Typography align="center" variant="subtitle2" m={2}>{message}</Typography>}
        </div>
    );

    return (
        <div style={{ margin: 16 }}>
            <Button variant='contained' onClick={() => setIsDialogOpened(!isDialogOpened)}>Add new Event</Button>

            <DialogForm
                isOpen={isDialogOpened}
                header={isUpdating ? 'Update an Event' : 'Add new Event'}
                handleDialogClose={handleDialogClose}
            >
                {newEventForm()}
            </DialogForm>

            <Typography variant="h4" align="center">Events</Typography>
            <Table
                search=''
                columns={columns}
                rows={events}
                indexing={true}
                onEdit={setToEdit}
                onDelete={handleDelete}
            />
        </div>
    )
};

export default Events;
