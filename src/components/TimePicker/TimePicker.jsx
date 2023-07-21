import dayjs from 'dayjs';

// material-ui imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

const TimePicker = (props) => {
    const {
        name,
        label = 'Sample Label',
        size = 'small',
        formikProps = null,
    } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
                name={name}
                label={label}
                size={size}
                fullWidth
                format="hh:mm a"
                value={formikProps?.values[name] ? dayjs(formikProps?.values[name]) : null}
                onChange={(time) => {
                    formikProps?.setFieldValue(name, new Date(time));
                    // console.log(new Date(time));
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

export default TimePicker;
