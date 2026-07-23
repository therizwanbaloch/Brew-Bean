import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser as apiRegisterUser, loginUser as apiLoginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Save state + localStorage
  const saveAuthData = (userData, userToken) => {
    console.log("💾 SAVING TO LOCALSTORAGE:", { userData, userToken });
    setUser(userData);
    setToken(userToken);

    if (userToken) {
      localStorage.setItem('token', userToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      const userId = userData._id || userData.id;
      if (userId) {
        localStorage.setItem('userId', userId);
      }
    }
  };

  // Flexible Login function
  const login = async (param1, param2) => {
    let userObj = null;
    let userToken = null;

    // Pattern 1: login(userData, token) -> Called as two separate arguments
    if (param2 && typeof param2 === 'string') {
      userObj = param1;
      userToken = param2;
    }
    // Pattern 2: login({ email, password }) -> Passed form credentials directly
    else if (param1?.email && param1?.password) {
      const res = await apiLoginUser(param1);
      userToken = res.token || res.accessToken || res.jwt;
      userObj = res.user || res.data || res;
    }
    // Pattern 3: login(res) -> Passed full API response object { success, token, user }
    else if (param1) {
      userToken = param1.token || param1.accessToken || param1.jwt || param1.data?.token;
      userObj = param1.user || param1.data?.user || param1.data || param1;
    }

    saveAuthData(userObj, userToken);
    return { user: userObj, token: userToken };
  };

  // Flexible Register function
  const register = async (userData) => {
    const res = await apiRegisterUser(userData);
    
    const userToken = res.token || res.accessToken || res.jwt || res.data?.token;
    const userObj = res.user || res.data?.user || res.data || res;

    saveAuthData(userObj, userToken);
    return res;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);