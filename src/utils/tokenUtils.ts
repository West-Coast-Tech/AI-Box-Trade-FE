// src/utils/tokenUtils.ts

import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

  const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    localStorage.removeItem('token')
    return true;
    }
  
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    const expired= decodedToken.exp < currentTime + 10
    if(expired) {
        localStorage.removeItem('token')
    }
    return expired;
  } catch (e) {
    
    localStorage.removeItem('token')
    return true;
  }
};

export default isTokenExpired