import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// local imports
import { db } from '../firebase/firebase.jsx';

export const getEventById = async (id) => {
    try {
        const eventCollection = collection(db, 'events');
        const eventDoc = doc(eventCollection, id);

        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
            return { ...eventSnapshot.data(), id: eventSnapshot.id };
        }
        else {
            return {};
        }
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

export const getEvents = async () => {
    const eventCollection = collection(db, 'events');
    const data = await getDocs(eventCollection);

    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getEventsByStudentId = async (student) => {
    try {
        const events = await getEvents();

        if (events?.length === 0) {
            return null;
        }

        const eventsForStudent = events.filter((event) => event.student === student);

        return eventsForStudent.length > 0 ? eventsForStudent : null;
    } catch (error) {
        console.error("Error fetching reps:", error);
    }
};

export const getEventsByCompanyId = async (company) => {
    try {
        const events = await getEvents();

        if (events?.length === 0) {
            return null;
        }

        const eventsForCompany = events.filter((event) => event.company === company);

        return eventsForCompany.length > 0 ? eventsForCompany : null;
    } catch (error) {
        console.error("Error fetching reps:", error);
    }
};

export const checkEvent = async (company, student, interviewDateTime) => {
    try {
        const currentEvents = await getEvents();

        if (currentEvents?.length) {
            return null;
        }

        const events = [];
        currentEvents?.map((event) => {
            if (event.company === company && event.student === student && event.interviewDateTime === interviewDateTime) {
                events.push({ ...event });
            }
        });

        return events.length > 0 ? true : false;
    }
    catch (error) {
        console.error("Error checking user:", error);
    }
};

export const validateWhenUpdatingEvent = async (newEvent) => {
    try {
        const studentEvents = await getEventsByStudentId(newEvent.student);

        const sortedStudentEvents = studentEvents.sort((e1, e2) => {
            return e1.created - e2.created;
        });

        const index = sortedStudentEvents.findIndex((event) => event.id === newEvent.id);
        if (index >= 0) {
            for (let i = index + 1; i < sortedStudentEvents.length; i++) {
                if (sortedStudentEvents[i].interviewDateTime <= newEvent.interviewDateTime) {
                    throw new Error('Interview date and time should be less than the next interview date and time' + sortedStudentEvents[i].interviewDateTime);
                }
            }
        }

        return true;
    }
    catch (error) {
        console.error("Error checking user:", error);
    }
};

export const addEvent = async (event) => {
    try {
        if (await checkEvent(event.company, event.student, event.interviewDateTime)) {
            throw new Error('Event already exists');
        }

        const eventCollection = collection(db, 'events');
        await addDoc(eventCollection, event);
    }
    catch (error) {
        console.error("Error adding event:", error);
        return error;
    }
};

export const updateUser = async (id, event) => {
    try {
        const eventCollection = collection(db, 'events');
        const newEvent = { name: event.name, age: event.age + 1 };
        const eventDoc = doc(eventCollection, id);
        await updateDoc(eventDoc, newEvent);
    }
    catch (error) {
        console.error("Error updating event:", error);
    }
};

export const deleteUser = async (id) => {
    try {
        const eventCollection = collection(db, 'events');
        const eventDoc = doc(eventCollection, id);
        await deleteDoc(eventDoc);
    }
    catch (error) {
        console.error("Error deleting event:", error);
    }
};
