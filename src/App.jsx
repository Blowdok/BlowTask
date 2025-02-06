import React, { useState, useEffect } from 'react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (input.trim() !== '') {
      if (editIndex !== null) {
        const newTodos = [...todos];
        newTodos[editIndex] = { ...newTodos[editIndex], text: input, category, dueDate };
        setTodos(newTodos);
        setEditIndex(null);
      } else {
        setTodos([...todos, { text: input, completed: false, category, dueDate }]);
      }
      setInput('');
      setCategory('');
      setDueDate('');
    }
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const editTodo = (index) => {
    setInput(todos[index].text);
    setCategory(todos[index].category);
    setDueDate(todos[index].dueDate);
    setEditIndex(index);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-md flex justify-center items-center">
        <div className="text-2xl font-bold text-yellow-500">
          {formatDate(currentTime)} - {formatTime(currentTime)}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">BlowTasks</h1>
          <button
            className="text-blue-500"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
            <input
              type="date"
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-md"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={addTodo}
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>
        <div className="flex space-x-4 mb-6">
          <button
            className={`flex-1 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`flex-1 py-2 rounded-md ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`flex-1 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <ul className="space-y-2">
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-600"
            >
              <span
                className={`flex-1 ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                onClick={() => toggleComplete(index)}
              >
                {todo.text} {todo.category && `(${todo.category})`} {todo.dueDate && ` - Due: ${todo.dueDate}`}
              </span>
              <div className="flex space-x-2">
                <button
                  className="text-blue-500"
                  onClick={() => editTodo(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => deleteTodo(index)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
