'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Importamos js-cookie
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const TokenContext = createContext();

export const useAuth = () => {
  return useContext(TokenContext);
};

const TokenProvider = ({ children }) => {
  const [token, setToken] = useState();   
  const [idUsuario, setIdUsuario] = useState();
  const router = useRouter();

  const decodeJWT = (token) => {
    const payloadBase64 = token.split('.')[1];  // El payload es la segunda parte del token
    const decodedPayload = atob(payloadBase64); // Decodifica de base64 a string
    return JSON.parse(decodedPayload);         // Convierte el string en objeto JSON
  };
  
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const register = async (username, name, lastName, phone, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, lastName, phone, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en localStorage y cookies
        localStorage.setItem('token', data.token);
        Cookies.set('token', data.token, { expires: 7 });
        setToken(data.token);

        // Decodificar el token y guardar el ID de usuario
        const decodedToken = decodeJWT(data.token);
        const idUsuario = decodedToken.id; 
        localStorage.setItem('idUsuario', idUsuario); 
        setIdUsuario(idUsuario);

        return { status: 200, message: data.message };
      } else {
        return { status: 300, message: data.message };
      }
    } catch (error) {
      console.error(error);  // Para depuración
      return { status: 400, message: error.message };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  return (
    <TokenContext.Provider value={{ register, token, idUsuario, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
export default TokenProvider;