import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Task } from './types';

const API = 'https://localhost:5001/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  function fetchAll() {
    axios.get<Task[]>(API)
      .then(res => setTasks(res.data))
      .catch(err => console.error('API GET error', err));
  }

  function addTask() {
    if (!desc.trim()) return;
    axios.post<Task>(API, { description: desc, isCompleted: false })
      .then(res => {
        setTasks(prev => [...prev, res.data]);
        setDesc('');
      })
      .catch(err => console.error('API POST error', err));
  }

  function toggle(id: number) {
    axios.put<Task>(`${API}/${id}`)
      .then(res => {
        setTasks(prev => prev.map(t => t.id === id ? res.data : t));
      })
      .catch(err => console.error('API PUT error', err));
  }

  function remove(id: number) {
    axios.delete(`${API}/${id}`)
      .then(() => setTasks(prev => prev.filter(t => t.id !== id)))
      .catch(err => console.error('API DELETE error', err));
  }

  return (
    <div style={{ maxWidth: 600, margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Basic Task Manager</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="New task description"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTask} style={{ padding: '8px 12px' }}>Add</button>
      </div>

      <ul style={{ marginTop: 20, paddingLeft: 0, listStyle: 'none' }}>
        {tasks.map(t => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div onClick={() => toggle(t.id)} style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={t.isCompleted} readOnly />{' '}
              <span style={{ textDecoration: t.isCompleted ? 'line-through' : 'none' }}>{t.description}</span>
            </div>
            <button onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
