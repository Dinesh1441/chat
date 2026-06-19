// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'



const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const location = useLocation();
  

  useEffect(() => {
    try {
      const response = axios.post(`${backendUrl}/api/users/auth`, {}, {
        withCredentials: true
      });
     
      response.then(res => {
        
        if (res.data.success) {
          if(!user){
            setUser(res.data.user);
            setLoading(false)
            console.log('User:', res.data.user);
           
          }else {
           
          }
          if(location.pathname === '/login'){
            navigate('/dashboard');
          }
          return true;
        } else {
          setUser(null)
          navigate('/login');
        }
        setLoading(false)
        return res.data.success;
      }).catch(err => {
        console.log('Error fetching user:', err);
        setUser(null)
        setLoading(false)
        navigate('/login')
      })
    } catch (error) {
      console.log('Unexpected error:', error);
      setUser(null)
      setLoading(false)
      // navigate('/login')
    }
  }, [user])

  const login = async (email, password) => {
    try {
    
      const response = await axios.post(`${backendUrl}/api/users/login`, { email, password }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Welcome back!');
        return true;
      } else {
        console.log('Success but success=false:', response.data);
        toast.error(response.data.message || 'Login failed');
        return false;
      }
      
    } catch (error) {
      
      console.log('Full error object:', error);
      toast.error(error.response.data?.message || 'Login failed');
      return false
    }
  }

const signup = async (name, email, password, gender) => {
  try {

    const formData = { name, email, password, gender, userType: 'registered' }  
    
    const response = await axios.post(`${backendUrl}/api/users/register`, formData, {
      withCredentials: true
    });
    
    if (response.data.success) {

      toast.success('Account created successfully!');
      navigate('/dashboard');
      return true;
    } else {
      console.log('Success but success=false:', response.data);
      toast.error(response.data.message || 'Signup failed');
      return false;
    }
    
  } catch (error) {
    // THIS IS WHERE 400 ERROR GOES
    console.log('=== CATCH BLOCK TRIGGERED ===');
    console.log('Full error object:', error);
    
    // Log the response (this is what you're missing)
    if (error.response) {
      console.log('Error response status:', error.response.status); // 400
      console.log('Error response data:', error.response.data); // THIS IS YOUR RESPONSE
      console.log('Error response headers:', error.response.headers);
      
      // Now you can see the error message
      toast.error(error.response.data?.message || 'Signup failed');
    } else if (error.request) {
      console.log('No response received:', error.request);
      toast.error('No response from server');
    } else {
      console.log('Error message:', error.message);
      toast.error(error.message);
    }
    
    return false;
  }
}

const guestLogin = async (name, gender) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const formData = { name, gender, userType: 'guest' }
    const response = await axios.post(`${backendUrl}/api/users/guest`, formData, {
      withCredentials: true
    });
    // console.log('SUCCESS Response:', response);
    // console.log('SUCCESS Data:', response.data);
    
    if (response.data.success) {
        setUser(response.data.user);
        toast.success('Logged in as guest!');
        navigate('/dashboard');
        return true;    
    } else {
      console.log('Success but success=false:', response.data);
      toast.error(response.data.message || 'Guest login failed');
      return false;
    }
    
  } catch (error) {
    console.log('Full error object:', error);
    toast.error(error.response?.data?.message || 'Guest login failed');
    return false
  }
}
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out')
  }

  const updateUser = async (data) => {
    try{
        const response = await axios.post(`${backendUrl}/api/users/update`, data, {
          withCredentials: true
        });
        console.log('SUCCESS Response:', response);
        console.log('SUCCESS Data:', response.data);
        if (response.data.success) {
          setUser({ ...user, ...response.data.user });
          toast.success('Profile updated successfully!');
          return true;
        } else {
          console.log('Success but success=false:', response.data);
          toast.error(response.data.message || 'Profile update failed');
          return false;
        }
        
    }catch{

        toast.error('Profile update failed');
        return false

    }
    
  }


  const updateUserInterests = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/update/interests`, data, {
        withCredentials: true
      });
      console.log('SUCCESS Response:', response);
      console.log('SUCCESS Data:', response.data);
      
      if (response.data.success) {
        console.log('Success but success=true:', response.data);
        setUser({ ...user, interests: response.data.interests });
        toast.success('Interests updated successfully!');
        return true;
      } else {
        console.log('Success but success=false:', response.data);
        toast.error(response.data.message || 'Interests update failed');
        return false;
      }
      
    } catch (error) {
      console.log('Full error object:', error);
      toast.error(error.response?.data?.message || 'Interests update failed');
      return false
    }
  }

  const updateGenderPreference = async (gender) => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/update/genderPreference`, { genderPreference: gender }, {
        withCredentials: true
      });
      console.log('SUCCESS Response:', response);
      console.log('SUCCESS Data:', response.data);
      
      if (response.data.success) {
        toast.success('Gender preference updated successfully!');
        return true;
      } else {
        console.log('Success but success=false:', response.data);
        toast.error(response.data.message || 'Gender preference update failed');
        return false;
      }
      
    } catch (error) {
      console.log('Full error object:', error);
      toast.error(error.response?.data?.message || 'Gender preference update failed');
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, guestLogin , updateUserInterests, updateGenderPreference }}>
      {children}
    </AuthContext.Provider>
  )
}