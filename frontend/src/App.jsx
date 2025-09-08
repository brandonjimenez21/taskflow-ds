import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import CreateTask from './pages/CreateTask.jsx'
import Header from './header/header.jsx'
import TasksPage from './pages/TaskPage.jsx'
import ManagerDashboard from './pages/management/Dashboard.jsx'
import Home from "./pages/home.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header/>
          <Routes>
            {/* Página inicial */}
            <Route path="/" element={<Home />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Funcionalidades internas */}
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/dashboard" element={<ManagerDashboard />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
