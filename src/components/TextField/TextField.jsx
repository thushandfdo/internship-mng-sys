// material-ui imports
import MuiTextField from '@mui/material/TextField';

const TextField = (props) => {
    const {
        type = 'text',
        variant = 'outlined',
        name,
        label,
        formikProps,
        width = '100%',
        updateStore,
        autoFocus = false,
        size = 'small',
        textTransform = 'none',
    } = props;

    return (
        <MuiTextField
            autoFocus={autoFocus}
            type={type}
            name={name}
            size={size}
            value={formikProps.values[name]}
            label={label}
            variant={variant}
            error={formikProps.errors[name] && formikProps.touched[name]}
            helperText={formikProps.touched[name] && formikProps.errors[name]}
            onChange={(updateStore && updateStore(name, formikProps.values[name])) || formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            sx={{ width, marginBottom: 2 }}
            inputProps={{
                style: { textTransform },
            }}
        />
    )
};

export default TextField;
