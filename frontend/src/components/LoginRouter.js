import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ component }) => {
    //Popup alert to user.
    alert("ProtectedRoute hit");
    const token = localStorage.getItem("token");

    //No token means no connected user so he has to login.
    if (!token) {
        return <Navigate to="/login" />;
    }

    return component;
}

