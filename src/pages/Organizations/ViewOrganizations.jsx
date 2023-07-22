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
        { id: 'groupLink', label: 'Group Link' },
        { id: 'round', label: 'Round' },
    ];

    return (
        <>
            <Typography variant="h5" align="center" mb={4}>Organizations</Typography>
            <Table search="" columns={columns} rows={orgList} />
        </>
    )
}

export default ViewOrganizations;