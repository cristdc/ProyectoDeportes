import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
const Login = () => {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  }
  if (error) {
    return <div>{error}</div>
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login