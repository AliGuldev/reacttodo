import React, { useState } from 'react';
import { apiRequest } from './api';

export default function AuthForm({ onAuthSuccess }) {
  //States
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });

  //Logging in or Registering check
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    const res = await apiRequest(endpoint, 'POST', form);
    const data = await res.json();

    //Handling successful auth and switching to login mode
    if (res.ok) {
      if (isLogin) {
        document.cookie = `authToken=${data.token}; path=/; samesite=strict`;
        onAuthSuccess();
      } else {
        alert('Registered! Now please login.');
        setIsLogin(true);
      }
    } else {
      alert(data.error || 'Action failed');
    }
  };

  //UI
  return (
    <section>
      <h2 style={{ color: '#000' }}>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <hr style={{marginBottom: '20px' }}></hr>
        <input type="text" placeholder="Username" required
          onChange={e => setForm({...form, username: e.target.value})} />
        <input type="password" placeholder="Password" required
          onChange={e => setForm({...form, password: e.target.value})} />
        <button style={{margin: '10px'}} type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </section>
  );
}