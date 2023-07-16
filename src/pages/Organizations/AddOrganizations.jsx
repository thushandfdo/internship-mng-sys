import { useState } from "react";

// material-ui imports
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// local imports
import { addOrg } from "../../utils/orgUtils";

const AddOrganization = () => {
    const [name, setName] = useState("");

    const [message, setMessage] = useState("");

    const handleClear = () => {
        setName("");
    };

    const handleRegister = async () => {
        try {
            await addOrg({name:name});
            setMessage("organization added successfully");
            handleClear();
        } catch (error) {
            console.log(error.code || '', error.message || error);
        }
    };


    return (
        <div style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <Stack direction="column" rowGap={2} width="50%" margin={"0 auto"} maxWidth={400}>
                <Typography variant="h5" align="center">Add organization</Typography>
                <TextField
                    autoFocus
                    required
                    size="small"
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    inputProps={{
                        style: { textTransform: 'uppercase' },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleRegister}
                >
                    Add
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClear}
                >
                    Clear
                </Button>

                {message && <Typography align="center" variant="subtitle2">{message}</Typography>}
            </Stack>
        </div>
    )
};

export default AddOrganization;
