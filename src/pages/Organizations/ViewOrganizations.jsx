import { useState,useEffect } from "react";
import { getOrgs } from "../../utils/orgUtils";
import Typography from "@mui/material/Typography";
import Table from "../../components/Table"

const ViewOrganizations =()=>{
    const [orgList, setOrgList] = useState([]);
    const [message, setMessage] = useState("");

    const  fetchOrg = async () =>{
        await getOrgs().then((res)=>{
            setOrgList(res)
        });
    }

    useEffect(() => {
        fetchOrg();
    }, [])

    const columns = [
        { id: 'name', label: 'Name' },
      ];

    return(
        <>
            <Typography variant="h5" align="center">Organizations</Typography>
            <Table search="" columns={columns} rows={orgList}/>
        </>
    )
}

export default ViewOrganizations;