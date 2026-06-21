import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPOST } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import '../style/index.css';
import '../style/Register.css';

async function register(username, displayName, password, phone, address, profilePic) {
    const body = new FormData();
    body.append('username', username);
    body.append('displayName', displayName);
    body.append('password', password);
    body.append('phone', phone);
    body.append('address', address);
    if (profilePic) body.append('profilePic', profilePic);
    
    const res = await sendPOST('/api/users', body);
    return res.token;
}

const handleFieldChange = (stateSetter) => (e) => stateSetter(e.target.value);

export const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [preview, setPreview] = useState(null);
    const profilePicRef = useRef(null);
    const { tokenToStorage } = useAuthContext();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const profilePic = profilePicRef.current?.files?.[0] || null;
            const newToken = await register(username, displayName, password, phone, address, profilePic);
            tokenToStorage(newToken);
            navigate("/");
        } catch (err) {
            try {
                const parsedError = JSON.parse(err.message);
                setError(parsedError.errors || err.message);
            } catch (e) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="register-form-container">
            <form onSubmit={handleRegister}>
                <input value={username} onChange={handleFieldChange(setUsername)} placeholder="Username" />
                {error?.username && <p className="register-error">{error.username[0]}</p>}
                
                <input value={password} onChange={handleFieldChange(setPassword)} type="password" placeholder="Password" />
                {error?.password && <p className="register-error">{error.password[0]}</p>}
                
                <input value={displayName} onChange={handleFieldChange(setDisplayName)} placeholder="Display Name" />
                {error?.displayName && <p className="register-error">{error.displayName[0]}</p>}
                
                <input value={phone} onChange={handleFieldChange(setPhone)} placeholder="phone" />
                {error?.phone && <p className="register-error">{error.phone[0]}</p>}
                
                <input value={address} onChange={handleFieldChange(setAddress)} placeholder="address" />
                {error?.address && <p className="register-error">{error.address[0]}</p>}
                
                <input type="file" id="profilePic" ref={profilePicRef} accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                }} />
                
                {error?.profilePic && <p className="register-error">{error.profilePic[0]}</p>}
                
                {preview && (
                    <img src={preview} alt="Preview" className="prev-img" />
                )}
                
                <button type="submit">Register</button>
                <button type="button" onClick={() => navigate('/')}>Back to Home</button>
            </form>
        </div>
    );
};