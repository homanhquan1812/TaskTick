import React, { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'
import axios from 'axios'

const NewlineText = ({ text }) => {
  return text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ))
}

const TruncatedText = ({ text, limit }) => {
  const truncatedText = text.length > limit ? text.substring(0, limit) + '...' : text
  return <NewlineText text={truncatedText} />
}

const AllTasks = () => {
  const navigateTo = useNavigate()
  const [userId, setUserId] = useState('')
  const [tasks, setTasks] = useState([])
  const [streak, setStreak] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 3

  const handleAddProduct = () => {
    navigateTo('/dailytask')
  }

  const taskDeleted = () => {
    navigateTo('/dailytask/deleted')
  }
  
  const deleteTask = async (id) => {  
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_WEB_SERVICE}/task/delete/tem/${id}`)
      
      if (response.status == 200) {
        console.log('Task deleted successfully.')
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const usersStreak = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_WEB_SERVICE}/user/streak/${userId}`)

      if (response.status === 200) {
        const data = await response.json()
        setStreak(data.streak.streak)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const taskFinished = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_APP_WEB_SERVICE}/task/${id}`, {
        finished: true
      })
  
      if (response.status === 200) {
        console.log('Task updated successfully.')
        fetchTasksAPI()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTasksAPI = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_WEB_SERVICE}/task/${userId}`, {
        withCredentials: true
      })
      const data = await response.json()
      setTasks(data.task)
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken._id)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      usersStreak()
      fetchTasksAPI()

      const intervalId = setInterval(() => {
        fetchTasksAPI()
        usersStreak()
      }, 2000)

      return () => clearInterval(intervalId)
    }
  }, [userId])

  // Calculate pagination based on all tasks
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentTasks = tasks.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(tasks.length / productsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      <Heads
        additionalStylesheets={[
          "/css/bootstrap.min.css",
          "/css/site.css",
          "/css/style.css"
        ]}
        additionalTitle={[
          "Task hằng ngày - TaskTick"
        ]}
      />
      <Headers />
      <div className="container">
        <main role="main" className="pb-3">
          <div>
            <br />
            <h2>Tất cả các task hằng ngày</h2>
            <br />
            <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Quay lại</button>
            <button type="button" style={{marginLeft: '10px'}} className="btn btn-warning" onClick={taskDeleted}>Task đã xóa</button>
            <div className='mt-4'>
              <div className='row'>
                {tasks.length === 0 ? (
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <p>Bạn chưa có task nào.</p>
                  </div>
                ) : (
                  currentTasks.map((task) => (
                    <div className="col-sm-6 col-lg-4" key={task._id}>
                      <div className="card" style={{marginTop: '16px', width: '100%', height: '410px'}}>
                        <img className="card-img-top" src={task.photo} style={{height: '200px', objectFit: 'cover'}} alt={task.title} />
                        <div className="card-body d-flex flex-column" style={{height: '210px'}}>
                          <h5 className="card-title">{task.title}</h5>
                          <div className="card-text flex-grow-1 overflow-auto mb-3">
                            <TruncatedText text={task.description} limit={100} />
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(1, 1fr)',
                            gridTemplateRows: 'repeat(1, auto)',
                            gap: '10px',
                            position: 'absolute', bottom: '10px', left: '25px', right: '25px'}}>
                            <button onClick={() => deleteTask(task._id)} className="btn btn-danger">Xóa task này</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <br />
            {totalPages > 1 && (
              <div className="pagination" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <div key={index}>
                    <button
                      style={{ margin: '0 3px' }}
                      onClick={() => paginate(index + 1)}
                      className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {index + 1}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footers />
    </div>
  )
}

export default AllTasks
