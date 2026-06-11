import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ component }) => {
    const token = localStorage.getItem("token");

    //No token means no connected user so he has to login.
    if (!token) {
        //Popup alert to user alerting him to sign in.
        alert("Protected Route hit please sign in");
        return <Navigate to="/login" />;
    }

    return component;
}

