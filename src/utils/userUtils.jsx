import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";

// local imports
import { auth } from '../firebase/firebase.jsx';
import { db } from '../firebase/firebase.jsx';

export const getUserById = async (id) => {
    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, id);

        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            return { ...userSnapshot.data(), id: userSnapshot.id };
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};

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

export const getUsersByRole = async (role) => {
    try {
        const users = await getUsers();

        if (users?.length === 0) {
            return null;
        }

        const filteredUsers = users.filter((user) =>
            (role === 'all-s')
                ? (user.role === 'student' || user.role === 'rep')
                : user.role === role
        );

        return filteredUsers.length > 0 ? filteredUsers : null;
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
    catch (error) {
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
    try {
        const usersCollection = collection(db, 'users');
        const newUser = { name: user.name, age: user.age + 1 };
        const userDoc = doc(usersCollection, id);
        await updateDoc(userDoc, newUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
    }
};

export const deleteUser = async (id) => {
    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, id);
        await deleteDoc(userDoc);
    }
    catch (error) {
        console.error("Error deleting user:", error);
    }
};
