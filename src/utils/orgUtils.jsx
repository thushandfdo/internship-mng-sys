import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase.jsx';
import {getUserById} from './userUtils.jsx'

export const getOrgById = async (id) => {
    try {
        const orgCollection = collection(db, 'organizations');
        const orgDoc = doc(orgCollection, id);
        
        const orgSnapshot = await getDoc(orgDoc);

        if (orgSnapshot.exists()) {
            return { ...orgSnapshot.data(), id: orgSnapshot.id };
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error fetching org:", error);
    }
};


export const getOrgs = async () => {
    const orgCollection = collection(db, 'organizations');
    const data = await getDocs(orgCollection);
  
    
    const getEventCounts = async (orgId) => {
      const eventsCollection = collection(db, 'events');
      const querySnapshot = await getDocs(
        query(eventsCollection, where('company', '==', orgId))
      );
  
      let selectedCount = 0;
      let ongoingCount = 0;
      let rejectedCount = 0;
      let notSelectedCount = 0;
  
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        if (event.status === 'selected') {
          selectedCount++;
        } else if (event.status === 'ongoing') {
          ongoingCount++;
        } else if (event.status === 'rejected') {
          rejectedCount++;
        } else if (event.status === 'not selected') {
          notSelectedCount++;
        }
      });
  
      return { selectedCount, ongoingCount, rejectedCount, notSelectedCount };
    };
  
    
    const orgsWithCounts = await Promise.all(
      data.docs.map(async (doc) => {
        const orgId = doc.id;
        const eventCounts = await getEventCounts(orgId);
        return { ...doc.data(), id: orgId, ...eventCounts };
      })
    )
    return orgsWithCounts;
  };
  

export const checkOrg = async (name) => {
    const orgList = await getOrgs();

    if (orgList?.length === 0) {
        return null;
    }
    const orgs = [];
    orgList && orgList.map((org) => {
        if (org.name.toLowerCase() === name.toLowerCase()) orgs.push({ ...org });
    });
    return orgs.length > 0 ? true : false;
};

export const addOrg = async (org) => {
    const orgCollection = collection(db, 'organizations');
    await addDoc(orgCollection, org);
};

export const updateOrg = async (id, org) => {
    try{
        const orgCollection = collection(db, 'organizations');
        const newOrg = { name: org.name };
        const orgDoc = doc(orgCollection, id);
        await updateDoc(orgDoc, newOrg);
    }
    catch(error){
        console.error( "Error Updating:",error);
    }
    
};

export const deleteOrg = async (id) => {
    try{
        const orgCollection = collection(db, 'organizations');
        const orgDoc = doc(orgCollection, id);
        await deleteDoc(orgDoc);
    }
    catch(error){
        console.log(error)
    }
};

export const getOrgsByStudent = async (studentId) => {
    try {
        const eventsCollection = collection(db, 'events');
        const studentEvents = await getDocs(query(eventsCollection, where('student', '==', studentId)));
        const companies = await Promise.all(studentEvents.docs.map(async (doc) => {
            const data = doc.data();
            try {
                const orgSnapshot = await getOrgById(data.company);
                const company = orgSnapshot.name;
                return {
                    company: company,
                    status: data.status
                };
            } catch (err) {
                console.log(`Unable to fetch organizations`, err);
                return null;
            }
        }));

        return companies.filter(Boolean);
    } catch (error) {
        console.error("Error fetching companies by student:", error);
        return [];
    }
};


export const getStudentsByCompany = async (companyName) =>{
    try{
        const orgCollection = collection(db, 'organizations');
        const orgSnapshot = await getDocs(query(orgCollection, where('name', '==', companyName)));

        if(orgSnapshot.empty){
            console.log('No company found with the given name');
            return [];
        }

        const OrgId=orgSnapshot.docs[0].id

        const eventsCollection = collection(db, 'events');
        const eventsQuerySnapshot = await getDocs(query(eventsCollection, where('company', '==', OrgId)));

        
        const uniqueNamesSet = new Set();
        const students = [];

        for(const doc of eventsQuerySnapshot.docs){
            const data=doc.data();
            const studentId=data.student;
            const status=data.status;

            getUserById(studentId)
            .then((res)=>{
                const regNo = res.regNo
                const firstName = res.firstName;
                const lastName = res.lastName;
                const fullName = `${firstName} ${lastName}`;
                if (!uniqueNamesSet.has(fullName)) {
                    uniqueNamesSet.add(fullName);
                    students.push({ regNo, name: fullName });
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        console.log(students)
        return students;

        
    }
    catch(error){
        console.error("Error fetching students by company:", error);
        return [];
    }
}



