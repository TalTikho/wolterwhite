import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  token: string | null;
  tokenToStorage: (token: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  tokenToStorage: async () => {},
  logOut: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const stored = await AsyncStorage.getItem('token');
        if (stored) setToken(stored);
      } catch (e) {
        console.error('Error loading token:', e);
      }
    };
    loadToken();
  }, []);

  const tokenToStorage = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('justLoggedIn', 'true');
      setToken(newToken);
    } catch (e) {
      console.error('Error saving token:', e);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
    } catch (e) {
      console.error('Error removing token:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, tokenToStorage, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};