import React from 'react';
import '../index.css'; 
import { BackG } from '../components/BgImage';
import { Login } from './LoginPage';

export const Landing = (onLoginSuccess) => {

    return (
        <div>
            <h3>Wolterwhite</h3>
            <div className="Home">
                <BackG />
               {/*We keep passing onLoginSuccess down to LoginPage to change the state*/}
                <Login onLoginSuccess={onLoginSuccess} />
            </div>

        </div>
    );
}