import React from 'react';
import '../index.css';

export const Login = () => {

    return (
        <div>
        <form method="post" action="http://localhost:5000/login">
            <input name="username" />
            <input type="password" name="password" />
            <input type="submit" />
        </form>
        </div>
    );
}