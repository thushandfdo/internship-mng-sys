import { useState, useEffect } from "react";
import { auth } from '../../firebase/firebase.jsx';

// material-ui imports
import Typography from "@mui/material/Typography";

// local imports
import { getOrgs,getStudentsByCompany,getOrgsByStudent } from "../../utils/orgUtils";
import { getUser } from '../../utils/userUtils.jsx';
import { Table } from "../../components";

const ViewOrganizations = () => {
    const [orgList, setOrgList] = useState([]);
    const [userOrgs, setUserOrgs] = useState([]);
    const [stdList, setStdList] = useState(null);
    const [grpLink, setGrpLink] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = async (email) => {
            if (email) {
                const loggedUser = await getUser(email);
                if (loggedUser) setCurrentUser(loggedUser);
                fetchStudentOrgs(loggedUser.id); 
            }
        };

        const fetchOrg = async () => {
            await getOrgs()
            .then((res) => {
                
                setOrgList(res)
                setGrpLink(res[0].groupLink)
            })
            .catch((err)=>{
                console.log(err)
            })
        }

        const fetchStudentOrgs = async (user) =>{
            await getOrgsByStudent(user)
            .then((res)=>{
                setUserOrgs(res)
            })
            .catch((err)=>{
                console.log(err)
            }) 
        }

        getCurrentUser(auth.currentUser?.email);
        fetchOrg(); 
           
    }, []);




    const mainColumns = [
        { id: 'round', label: '#Round',filterField: [{key:"1",value:"Round 1"},{key:"2",value:"Round 2"}] },
        { id: 'name', label: 'Company Name',filterField: 'text' },
    ];

    const studentColumns = [
        { id: 'regNo', label: 'Index No',filterField: 'text' },
        { id: 'name', label: 'Name',filterField: 'text' },
    ];

    if (currentUser?.role==="rep" || currentUser?.role==="superAdmin") {
        mainColumns.push(
            
            { id: 'ongoingCount', label: 'Ongoing' },
            { id: 'selectedCount', label: 'Selected' },
            { id: 'notSelectedCount', label: 'NS' },
            { id: 'rejectedCount', label: 'rejected' },
            );
    }

    

    const renderCompanyName = (name) => {
        const handleClick =  async (name)=>{
            setStdList(null);
             await getStudentsByCompany(name)
            .then((res)=>{
                 setStdList(res)  
            })
            .catch((error)=>{
                console.log(error)
            })
            
        }
        if (!currentUser?.role==="rep" && userOrgs && userOrgs.some((org) => org.company === name)) {
            console.log(1)
            return (
                <span
                    onClick={() => handleClick(name)}
                    style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                >
                    {name}
                </span>
            );
        } 
        if(currentUser?.role==="rep") {
            return(
                <span
                onClick={() => handleClick(name)}
                style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
            >
                {name}
                </span>
            )
        }
        return <span>{name}</span>
    };

    const handleClear = ()=>{
        setStdList(null)
    }

    return (
        <>
        <div style={{ display: "flex", justifyContent:"space-evenly",gap:"2vw"}}>
            <div>
                <Typography variant="h4" align="center" mb="2vh" mt="2vh">Organizations</Typography>
                <Table 
                columns={mainColumns} 
                rows={orgList.map((org) => ({
                        ...org,
                        name: renderCompanyName(org.name),
                    }))}
                indexing={true} />
            </div>


            {stdList && <div>
            <Typography variant="h4" align="center" mb="3vh" mt="1vh">Details</Typography>
             <a href={grpLink} style={{position:"relative",bottom:"2vh"}}>WHATSAPP GROUP LINK</a>
            <Table 
                columns={studentColumns}
                rows={stdList}
                indexing={true} />
            <button onClick={handleClear} style={{marginTop:"2vh"}}>clear</button>
            </div>} 
        </div>
            
        </>
    )
}

export default ViewOrganizations;