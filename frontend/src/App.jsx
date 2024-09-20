import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AddTask from './pages/AddTask'
import Error from './pages/Error'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Task from './pages/Task'
import EditTask from './pages/EditTask'
import Info from './pages/Info'
import Success from './pages/Success'
import TaskDetail from './pages/TaskDetail'
import TaskDeleted from './pages/TaskDeleted'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const isJwtExpired = (token) => {
    if (!token) return true
    const parts = token.split('.')
    if (parts.length !== 3) return true
    try {
        const payload = JSON.parse(atob(parts[1]))
        if (!payload.exp) return false
        const currentTime = Math.floor(Date.now() / 1000)
        return payload.exp < currentTime
    } catch (error) {
        console.error('Error decoding token:', error)
        return true
    }
  }

  useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token')
            if (token && !isJwtExpired(token)) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
                localStorage.removeItem('token')
            }
        }

        checkLoginStatus()
        const intervalId = setInterval(checkLoginStatus, 1000) // Check every second

        return () => clearInterval(intervalId)
    }, [])

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="*" element={<Error></Error>}></Route>
      </Routes>
    )
  }
  else {
    return (
      <Routes>
        <Route exact path="/" element={<Home></Home>}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/dailytask" element={<Task></Task>}></Route>
        <Route path="/dailytask/deleted" element={<TaskDeleted></TaskDeleted>}></Route>
        <Route path="/dailytask/add" element={<AddTask></AddTask>}></Route>
        <Route path="/dailytask/edit/:id" element={<EditTask></EditTask>}></Route>
        <Route path="/dailytask/detail/:id" element={<TaskDetail></TaskDetail>}></Route>
        <Route path="/info/:id" element={<Info></Info>}></Route>
        <Route path="/success" element={<Success></Success>}></Route>
        <Route path="*" element={<Error></Error>}></Route>
      </Routes>
    )
  }
}

export default App
