import { React, useState, useEffect, createContext, useContext } from "react";

//Create context
const AuthContext = createContext();
//Hook for getting the context implicitly returning it.
export const useAuthContext = () => useContext(AuthContext);


//provider componenet.
export const TokenProvider = ({ children }) => {
    //Set the token's state Immediately as the function is accessed by children of the hook.
    //If no token exists in storage token's state is set to null.
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    useEffect(() => {
        //setup for the effect
        const handleStorageChange = (event) => {
            //Check if the exact 'token' key was altered
            if (event.key === "token" || event.key == null) {
                //If newValue is null, it means it was deleted
                if (!event.newValue) {
                    logOut();
                }
            }
        };

        //Attach the listener to the browser
        //It listens to cross browser-tab token deletions.
        window.addEventListener("storage", handleStorageChange);

        //The Cleanup Function for the effect
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []); //This setup only runs once when the site loads

//Save token to storage and save the state.
const tokenToStorage = (token) => {
    localStorage.setItem("token", token)
    setToken(token);
    //Welcome the user once after login, we
    //will remove justLoggedIn after welcoming the
    //user with an alert.
    localStorage.setItem("justLoggedIn", "true");
};
//LogOut sets the token's state to null and removes it from storage.
const logOut = () => {
    setToken(null)
    localStorage.removeItem("token");
};


//Return the component's provider to its children.
return (
    <AuthContext.Provider value={{ token, tokenToStorage, logOut }}>
        {children}
    </AuthContext.Provider>
)
};