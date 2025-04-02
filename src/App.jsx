import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = 'https://todo-f-z4r8.onrender.com/api'

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`)
      const data = await response.json()
      setTodos(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch todos')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      })
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInputValue('')
    } catch (err) {
      setError('Failed to add todo')
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditValue(todo.text)
  }

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editValue }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo =>
        todo._id === id ? updatedTodo : todo
      ))
      setEditingId(null)
      setEditValue('')
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  const toggleComplete = async (id) => {
    const todo = todos.find(t => t._id === id)
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo =>
        todo._id === id ? updatedTodo : todo
      ))
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="todo-container">
      <h1 style={{ color: 'white', textAlign: 'center', fontSize: '3em' }}>Todo List</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
          className="todo-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {editingId === todo._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(todo._id)} className="save-button">
                  Save
                </button>
              </div>
            ) : (
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id)}
                />
                <span className="todo-text">{todo.text}</span>
                <div className="todo-actions">
                  <button onClick={() => startEditing(todo)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

