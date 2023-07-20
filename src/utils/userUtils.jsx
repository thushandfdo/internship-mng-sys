import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";

// local imports
import { auth } from '../firebase/firebase.jsx';
import { db } from '../firebase/firebase.jsx';

export const getUser = async (email) => {
    try {
        const users = await getUsers();

        if (users?.length === 0) {
            return null;
        }

        const user = users.filter((user) => user.email === email);

        return user.length > 0 ? user[0] : null;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

export const getUsers = async () => {
    const usersCollection = collection(db, 'users');
    const data = await getDocs(usersCollection);

    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getReps = async () => {
    try {
        const users = await getUsers();

        if (users?.length === 0) {
            return null;
        }

        const reps = users.filter((user) => user.role === 'rep');

        return reps.length > 0 ? reps : null;
    } catch (error) {
        console.error("Error fetching reps:", error);
    }
};

export const checkUser = async (regNo, email) => {
    try {
        const registeredUsers = await getUsers();

        if (registeredUsers?.length) {
            return null;
        }

        const users = [];
        registeredUsers?.map((user) => {
            if (user?.regNo?.toLowerCase() === regNo.toLowerCase() || user?.email === email) {
                users.push({ ...user });
            }
        });

        return users.length > 0 ? true : false;
    }
    catch(error) {
        console.error("Error checking user:", error);
    }
};

export const addUser = async (user, password) => {
    user.role = user.role ?? 'student';
    user.firstName = user.firstName ?? '';
    user.lastName = user.lastName ?? '';

    try {
        await createUserWithEmailAndPassword(auth, user.email, password);

        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, user);
    }
    catch (error) {
        console.error("Error adding user:", error);
    }
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
