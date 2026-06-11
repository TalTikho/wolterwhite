import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ component }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        //Send the unauthorized visitor to login, but attach a hidden state error object
        return <Navigate to="/login" state={{ authError: "Please sign in to access this page." }} />;
    }

    return component;
}