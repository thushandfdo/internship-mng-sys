import { useState, useEffect } from "react";
import { auth } from '../../firebase/firebase.jsx';

// material-ui imports
import Typography from "@mui/material/Typography";

// local imports
import { getOrgs } from "../../utils/orgUtils";
import { Table } from "../../components";

const ViewOrganizations = () => {
    const [orgList, setOrgList] = useState([]);
    const [grpLink, setGrpLink] = useState("");
    const [isclicked, setIsClicked] = useState(false);

    const fetchOrg = async () => {
        await getOrgs().then((res) => {
            setOrgList(res)
            setGrpLink(res[0].groupLink)
        });
    }
    console.log()

    useEffect(() => {
        fetchOrg();
    }, [])

    const columns = [
        { id: 'round', label: '#Round' },
        { id: 'name', label: 'Company Name' },
    ];

    if (0) {
        columns.push({ id: 'groupLink', label: 'WhatsApp Group Link' });
    }

    const renderCompanyName = (name) => {
        if (name==="LSEG") {
            return (
                <span
                onClick={()=>setIsClicked(true)} 
                style={{textDecoration:"underline",cursor:"pointer",color:"blue"}}>
                    {name}
                </span>
            )
        }
        else {
            return <span>{name}</span>;
        }
    };

    return (
        <>
        <div style={{ display: "flex", justifyContent:"space-evenly"}}>
            <div>
                <Typography variant="h4" align="center" mb="2vh">Organizations</Typography>
                <Table 
                search={''} 
                columns={columns} 
                rows={orgList.map((org) => ({
                        ...org,
                        name: renderCompanyName(org.name),
                    }))}
                indexing={true} />
            </div>
            {isclicked && <div>
            <Typography variant="h4" align="center" mb="3vh">Details</Typography>
            <a href={grpLink} style={{position:"relative",bottom:"2vh"}}>WHATSAPP GROUP LINK</a>
            <Table 
                search={''} 
                columns={[{ id: 'round', label: 'Student' }]} 
                rows={orgList.map((org) => ({
                        round:org.round
                    }))}
                indexing={true} />
            </div>} 
        </div>
            
        </>
    )
}

export default ViewOrganizations;