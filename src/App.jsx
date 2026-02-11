import React, { useState, useEffect } from 'react';
import { apiRequest, getAuthToken } from './api';
import AuthForm from './Auth';
import TodoItem from './TodoItem';

//Styling
const inputStyle = {
  width: '100%',
  height: '40px',
  marginBottom: '8px',
  padding: '8px',
  boxSizing: 'border-box'
};
const styles = {
  screenWrapper: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',  
    minHeight: '100vh',      
    width: '100vw',       
    backgroundColor: '#cfcfcf',
    fontFamily: "'Outfit', sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  appCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  }
};

function App() {
  //States
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  //Loading the to dos
  const loadTodos = async () => {
    const res = await apiRequest('/todos');
    if (res.ok) setTodos(await res.json());
  };
  useEffect(() => {
    if (isLoggedIn) loadTodos();
  }, [isLoggedIn]);

  //Editing and posting to dos
  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const method = editingTodo ? 'PUT' : 'POST';
    const url = editingTodo ? `/todos/${editingTodo.id}` : '/todos';
    
    const res = await apiRequest(url, method, data);
    if (res.ok) {
      setEditingTodo(null);
      e.target.reset();
      loadTodos();
    }
  };

  //Logging out
  const logout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
  };
  if (!isLoggedIn) {
    return (
      <div style={styles.screenWrapper}>
        <div style={styles.appCard}>
          <AuthForm onAuthSuccess={() => setIsLoggedIn(true)} />
        </div>
      </div>
    );
  }

  //App UI
  return (
    <div style={styles.screenWrapper}>
    <div style={styles.appCard}>
    
    <main>
      <button onClick={logout}>Logout</button>
      <h2 style={{ color: '#000' }}>My Todos</h2>      <form onSubmit={handleTodoSubmit}>
    <hr style={{marginBottom: '20px' }}></hr>
      
      <input 
      style={inputStyle} 
      name="title" 
      placeholder="Title" 
      required 
      defaultValue={editingTodo?.title || ''} 
      key={editingTodo?.id + 't'} 
    />
    <textarea 
      style={{ ...inputStyle, resize: 'none' }}
      name="description" 
      placeholder="Desc" 
      defaultValue={editingTodo?.description || ''} 
      key={editingTodo?.id + 'd'} 
    />
  <button type="submit">Add</button>
      {editingTodo && <button type="button" onClick={() => setEditingTodo(null)}>Cancel</button>}
      </form>

      <ul style={{paddingLeft: '0px' }}>
        {todos.map(t => (
          <TodoItem 
            key={t.id} 
            todo={t} 
            onDelete={async (id) => { await apiRequest(`/todos/${id}`, 'DELETE'); loadTodos(); }}
            onToggle={async (id, status) => { await apiRequest(`/todos/${id}`, 'PUT', { completed: !status }); loadTodos(); }}
            onEdit={setEditingTodo}
          />
        ))}
      </ul>
    </main>
    </div>
    </div>
  );
}

export default App;