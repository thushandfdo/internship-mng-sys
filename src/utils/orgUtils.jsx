import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.jsx';

export const getOrgs = async () => {
    const orgCollection = collection(db, 'organizations');
    const data = await getDocs(orgCollection);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
    const orgCollection = collection(db, 'organizations');
    const newOrg = { name: org.name };
    const orgDoc = doc(orgCollection, id);
    await updateDoc(orgDoc, newOrg);
};

export const deleteOrg = async (id) => {
    const orgCollection = collection(db, 'organizations');
    const orgDoc = doc(orgCollection, id);
    await deleteDoc(orgDoc);
};

