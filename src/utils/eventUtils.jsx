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

export const getEventsByStudentAndCompany = async (studentId, companyId) => {
    try {
        const events = await getEvents();

        if (events?.length === 0) {
            return null;
        }

        const eventsForStudentAndCompany = events.filter((event) =>
            event.student === studentId && event.company === companyId
        );

        return eventsForStudentAndCompany.length > 0 ? eventsForStudentAndCompany : null;
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

const validateEventDates = (event) => {
    if (event.calledDateTime > event.interviewDateTime) {
        throw new Error('Interview date should be greater than call date');
    }
};

export const validateBeforeInsert = async (newEvent) => {
    try {
        validateEventDates(newEvent);

        const studentEvents = await getEventsByStudentAndCompany(newEvent.student, newEvent.company);

        if (studentEvents?.length === 0) {
            return true;
        }

        const eventsOtherThanSelected = studentEvents.filter(event => event.status !== 'selected');

        if (eventsOtherThanSelected?.length > 0) {
            throw new Error('All the previous events should be marked as selected');
        }

        return true;
    }
    catch (error) {
        throw new Error(error);
    }
};

export const validateBeforeUpdate = async (updatingEvent) => {
    try {
        validateEventDates(updatingEvent);

        const studentEvents = await getEventsByStudentAndCompany(updatingEvent.student, updatingEvent.company);

        console.log('studentEvents', studentEvents);

        const sortedStudentEvents = studentEvents.sort((e1, e2) => {
            return e1.created - e2.created;
        });

        console.log('sortedStudentEvents', sortedStudentEvents);

        const index = sortedStudentEvents.findIndex((event) => event.id === updatingEvent.id);

        for (let i = 0; i < sortedStudentEvents.length; i++) {
            const event = sortedStudentEvents[i];

            if (i < index && (
                updatingEvent.interviewDateTime <= event.interviewDateTime ||
                updatingEvent.calledDateTime <= event.calledDateTime 
            )) {
                throw new Error('Interview date should be greater than all the previous events');
            }
            else if (i > index &&
                (
                    updatingEvent.interviewDateTime >= event.interviewDateTime ||
                    updatingEvent.calledDateTime >= event.calledDateTime ||
                    updatingEvent.status !== 'selected'
                )
            ) {
                throw new Error('All the previous events should be marked as selected');
            }
        }

        return true;
    }
    catch (error) {
        throw new Error(error);
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

export const updateEvent = async (id, newEvent) => {
    try {
        const eventCollection = collection(db, 'events');
        const eventDoc = doc(eventCollection, id);
        await updateDoc(eventDoc, newEvent);
    }
    catch (error) {
        console.error("Error updating event:", error);
    }
};

export const deleteEvent = async (id) => {
    try {
        const eventCollection = collection(db, 'events');
        const eventDoc = doc(eventCollection, id);
        await deleteDoc(eventDoc);
    }
    catch (error) {
        console.error("Error deleting event:", error);
    }
};
