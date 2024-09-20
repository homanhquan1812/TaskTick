import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const NewlineText = ({ text }) => {
  if (!text) return null; // Return null if text is undefined or null
  return text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ))
}

const TaskDetail = () => {
    const { id } = useParams()
    const [taskId, setTaskId] = useState([])
    const navigateTo = useNavigate()

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const deleteTask = async (id) => {  
      try {
        const response = await axios.delete(`https://tasktick-0j1f.onrender.com/task/delete/tem/${id}`)
        
        if (response.status == 200) {
          navigateTo('/dailytask')
          console.log('Task deleted successfully.')
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  
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

    const taskFinished = async (id) => {
      try {
        const response = await axios.put(`https://tasktick-0j1f.onrender.com/task/${id}`, {
          finished: true
        })
    
        if (response.status === 200) {
          console.log('Task updated successfully.')
          navigateTo('/dailytask')
          fetchProductsAPI()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const goBack = () => {
      navigateTo('/dailytask')
    }

    const fetchTaskIdAPI = async () => {
      try {
        const response = await fetch(`https://tasktick-0j1f.onrender.com/task/detail/${id}`)

        if (response.status == 200) {
          console.log('Data fetched successfully.')
          const data = await response.json()
          setTaskId(data.task)
        }
      } catch (error) {
        console.error("Error: ", error)
      }
    }

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token')
      if (token && !isJwtExpired(token)) {
          setIsLoggedIn(true)
      } else {
          setIsLoggedIn(false)
          localStorage.removeItem('token')
      }
    }

    useEffect(() => {
      fetchTaskIdAPI()
      checkLoginStatus()
    
        // Fetch data every 2 seconds
        const intervalId = setInterval(() => {
          fetchTaskIdAPI()
          checkLoginStatus()
        }, 2000)
    
        return () => clearInterval(intervalId)
      }, [])

  return (
    <div>
        <Heads
        additionalStylesheets={[
          "/css/bootstrap.min.css",
          "/css/site.css",
          "/css/style.css"
        ]}
        additionalTitle={[
          "Chi tiết khóa học - R2Sshop"
        ]}></Heads>
        <Headers></Headers>
        <div class="container">
            <main role="main" class="pb-3">
              <button type="button" className="btn btn-primary" onClick={goBack}>Quay lại</button>
            </main>
        </div>
        <div className="container mt-4">
                {taskId && (
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title mb-4">{taskId.name}</h1>
                            <div className="row">
                                <div className="col-md-6">
                                    <img 
                                        style={{width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover'}} 
                                        className="img-fluid" 
                                        src={taskId.photo} 
                                        alt={taskId.name} 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="card-text" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        <NewlineText text={taskId.description} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                                    <button style={{width: '150px'}} type='button' onClick={() => taskFinished(taskId._id)} className="btn btn-success me-md-2">Đã xong task này</button>
                                    <a style={{width: '150px'}} href={`/dailytask/edit/${taskId._id}`} className="btn btn-warning">Chỉnh sửa task</a>
                                    <button style={{width: '150px'}} type='button' onClick={() => deleteTask(taskId._id)} className="btn btn-danger me-md-2">Xóa task này</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Footers></Footers>
    </div>
  )
}

export default TaskDetail