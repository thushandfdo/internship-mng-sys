import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.jsx';

export const getUsers = async () => {
    const usersCollection = collection(db, 'users');
    const data = await getDocs(usersCollection);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const checkUser = async (regNo, email) => {
    const registeredUsers = await getUsers();

    if (registeredUsers?.length === 0) {
        return null;
    }

    const users = [];
    registeredUsers && registeredUsers.map((user) => {
        if (user?.regNo?.toLowerCase() === regNo.toLowerCase() || user?.email === email) {
            users.push({ ...user });
        }
    });

    return users.length > 0 ? true : false;
};

export const addUser = async (user) => {
    const usersCollection = collection(db, 'users');
    await addDoc(usersCollection, user);
};

export const updateUser = async (id, user) => {
    const usersCollection = collection(db, 'users');
    const newUser = { name: user.name, age: user.age + 1 };
    const userDoc = doc(usersCollection, id);
    await updateDoc(userDoc, newUser);
};

export const deleteUser = async (id) => {
    const usersCollection = collection(db, 'users');
    const userDoc = doc(usersCollection, id);
    await deleteDoc(userDoc);
};
