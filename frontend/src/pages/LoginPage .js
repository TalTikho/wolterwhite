import React from 'react';
import '../index.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function login(username, password) {
    const data = { username, password };

    //send a post request to tokens in api to register a token.
    const res = await fetch("http://localhost:5000/api/tokens", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Invalid username or password");
    }

    //set the token is localStorage to access it in future calls to backend api.
    const { token } = await res.json();
    localStorage.setItem("token", token);
    //Welcome the user once after login, we
    //will remove justLoggedIn after welcoming the
    //user with an alert.
    localStorage.setItem("justLoggedIn", "true");
    return token;
}

export const Login = () => {
    //No need for the password after we get the login but username should be reachable and updated.
    const [username, setUsername] = useState("");
    const passwordRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError(null);
            const password = passwordRef.current.value;
            await login(username, password);
            //navigate to HomePage (same address as landing but different page)
            //HomeRouter should find the token and send us to HomePage and not to LandingPage
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <input value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" />
            <input ref={passwordRef} type="password" placeholder='Password' />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}