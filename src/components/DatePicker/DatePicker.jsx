// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';

// material-ui imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

const DatePicker = (props) => {
    const {
        name,
        label = 'Sample Label',
        size = 'small',
        formikProps = null,
    } = props;

    return (
        // <DatePicker
        //     name={name}
        //     selected={formikProps?.values[name] ?? ''}
        //     onChange={(date) => formikProps?.setFieldValue(name, date)}
        //     dateFormat="dd/MM/yyyy"
        //     customInput={
        //         <TextField
        //             label={label}
        //             variant="outlined"
        //             fullWidth
        //             size={size}
        //             name={name}
        //             sx={{ mb: 2 }}
        //         />
        //     }
        //     style={{ width: '100%' }}
        // />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
                name={name}
                label={label}
                size={size}
                fullWidth
                inputformat="DD/MM/YYYY"
                value={formikProps?.values[name] ? dayjs(formikProps?.values[name]) : null}
                onChange={(date) => {
                    formikProps?.setFieldValue(name, new Date(date));
                    // console.log(new Date(date));
                }}
                slotProps={{
                    textField: {
                        variant: 'outlined',
                        error: formikProps?.touched[name] && Boolean(formikProps?.errors[name]),
                        helperText: formikProps?.touched[name] && formikProps?.errors[name],
                    }
                }}
                sx={{ mb: 2 }}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;
