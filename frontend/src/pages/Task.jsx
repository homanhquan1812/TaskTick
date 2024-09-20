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

const Task = () => {
  const navigateTo = useNavigate()
  const [userId, setUserId] = useState('')
  const [task, setTask] = useState([])
  const [streak, setStreak] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 3

  const handleAddProduct = () => {
    navigateTo('/dailytask/add')
  }

  const taskDeleted = () => {
    navigateTo('/dailytask/deleted')
  }

  const usersStreak = async () => {
    try {
      const response = await fetch(`https://tasktick-0j1f.onrender.com/user/streak/${userId}`)

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
      const response = await axios.put(`https://tasktick-0j1f.onrender.com/task/${id}`, {
        finished: true
      })
  
      if (response.status === 200) {
        console.log('Task updated successfully.')
        fetchProductsAPI()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProductsAPI = async () => {
    try {
      const response = await fetch(`https://tasktick-0j1f.onrender.com/task/${userId}`, {
        withCredentials: true
      })
      const data = await response.json()
      setTask(data.task)
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

    usersStreak()
    fetchProductsAPI()

    const intervalId = setInterval(() => {
      fetchProductsAPI()
      usersStreak()
    }, 2000)

    return () => clearInterval(intervalId)
  }, [userId])

  // Filter out finished tasks
  const unfinishedTasks = task.filter(t => !t.finished)
  
  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentTasks = unfinishedTasks.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(unfinishedTasks.length / productsPerPage)

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
            <h2>Task hằng ngày</h2>
            <br />
            <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Thêm task mới</button>
            <button type="button" style={{marginLeft: '10px'}} className="btn btn-warning" onClick={taskDeleted}>Task đã xóa</button>
            <div className='mt-4'>
              <div className='row'>
                {task.length === 0 ? (
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <p>Bạn chưa có task nào.</p>
                  </div>
                ) : unfinishedTasks.length === 0 ? (
                  <div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <img style={{ width: '1000px', margin: '0 auto'}} src='/img/congratulation1.png' alt="Congratulations" />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px'}}>
                      <p>Đã hoàn thành tất cả các task, hẹn gặp lại bạn vào ngày mai! ^^</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px'}}>
                      <p>Chuỗi ngày hoàn thành đầy đủ task của bạn: <span style={{ fontWeight: 'bold', fontSize: '25px', color: 'red'}}>{streak}</span></p>
                    </div>
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
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gridTemplateRows: 'repeat(2, auto)',
                            gap: '10px',
                            position: 'absolute', bottom: '10px', left: '25px', right: '25px'}}>
                            <a onClick={() => taskFinished(task._id)} className="btn btn-success">Đã xong task này</a>
                            <a href={`/dailytask/detail/${task._id}`} className="btn btn-primary">Chi tiết task</a>
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

export default Task