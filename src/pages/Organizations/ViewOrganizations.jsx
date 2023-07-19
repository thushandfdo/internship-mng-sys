import { useState, useEffect } from "react";

// material-ui imports
import Typography from "@mui/material/Typography";

// local imports
import { getOrgs } from "../../utils/orgUtils";
import { Table } from "../../components";

const ViewOrganizations = () => {
    const [orgList, setOrgList] = useState([]);

    const fetchOrg = async () => {
        await getOrgs().then((res) => {
            setOrgList(res)
        });
    }

    useEffect(() => {
        fetchOrg();
    }, [])

    const columns = [
        { id: 'name', label: 'Name' },
    ];

    return (
        <>
            <Typography variant="h5" align="center">Organizations</Typography>
            <Table search="" columns={columns} rows={orgList} />
        </>
    )
}

export default ViewOrganizations;