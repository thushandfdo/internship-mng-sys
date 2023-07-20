// material-ui imports
import TextField from '@mui/material/TextField';
import MuiAutocomplete from '@mui/material/Autocomplete';

const Autocomplete = (props) => {
    const {
        name,
        options = null,
        variant = "outlined",
        label = 'Sample Label',
        optionLabel,
        size = 'small',
        formikProps = null,
    } = props;

    return (
        <div>
            <MuiAutocomplete
                name={name}
                defaultValue={options[0]}
                value={formikProps?.values[name] ?? null}
                options={options}
                getOptionLabel={(option) => option[optionLabel] ?? option.toString()}
                onChange={(_event_, newValue) => formikProps.setFieldValue(name, newValue)}
                renderInput={(params) => 
                    <TextField 
                        {...params} label={label} variant={variant} 
                        error={(formikProps?.errors[name] && formikProps?.touched[name]) ? true : false}
                        helperText={formikProps?.errors[name] && formikProps?.touched[name]}
                    />
                }
                size={size}
                sx={{ marginBottom: 2 }}
            />
        </div>
    )
};

export default Autocomplete;
