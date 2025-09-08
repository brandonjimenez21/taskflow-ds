import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import CreateTask from './pages/CreateTask.jsx'
import Header from './header/header.jsx'
import TasksPage from './pages/TaskPage.jsx'
import ManagerDashboard from './pages/management/Dashboard.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path = "/" element = { <Login/> }></Route>
          <Route path = "/create-task" element = { <CreateTask/> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
