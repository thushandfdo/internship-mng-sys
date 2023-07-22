import { useEffect, useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { auth } from "./firebase/firebase.jsx";

// local imports
import { SignUp, SignIn, AddOrganization, ViewOrganizations, Dashboard, AddUser, Events } from "./pages";
import "./App.css";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const Root = () => {
        return (
            <>
                <div className='app'><Outlet /></div>
            </>
        )
    }

    const ProtectedRoute = ({ element }) => {
        // if (!user) {
        //     return <Navigate to="/login" />;
        // }

        return element;
    };

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Root />}>
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
                <Route path="/add-user" element={<ProtectedRoute element={<AddUser />} />} />
                <Route path="/organization/add" element={<ProtectedRoute element={<AddOrganization />} />} />
                <Route path="/organization/view" element={<ProtectedRoute element={<ViewOrganizations />} />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />
}

export default App;
