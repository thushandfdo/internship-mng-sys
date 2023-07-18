import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet } from "react-router-dom";

// local imports
import { SignUp, SignIn, AddOrganization, ViewOrganizations, Dashboard } from "./pages";
import "./App.css";

const App = () => {
    const Root = () => {
        return (
            <div className='app'><Outlet /></div>
        )
    }

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Root />}>
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/organization/add" element={<AddOrganization />} />
                <Route path="/organization/view" element={<ViewOrganizations />} />
            </Route>
        ))

    return <RouterProvider router={router} />

}

export default App;
