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

const TaskDeleted = () => {
  const navigateTo = useNavigate()
  const [userId, setUserId] = useState('')
  const [task, setTask] = useState([])  // Ensure tasks are initialized as an array
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 3

  const handleAddProduct = () => {
    navigateTo('/dailytask')
  }

  const taskRestoration = async (id) => {
    try {
      const response = await axios.put(`https://tasktick-0j1f.onrender.com/task/deleted/${id}`, {
        deleted: false
      })
  
      if (response.status === 200) {
        console.log('Task restored successfully.')
        fetchProductsAPI()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`https://tasktick-0j1f.onrender.com/task/delete/per/${id}`)
      
      if (response.status == 200) {
        console.log('Task deleted successfully.')
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const fetchProductsAPI = async () => {
    try {
      const response = await fetch(`https://tasktick-0j1f.onrender.com/task/deleted/${userId}`, {
        withCredentials: true
      })
      const data = await response.json()
      setTask(data.task || []) // Safely set task, fallback to empty array if undefined
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

    fetchProductsAPI()

    const intervalId = setInterval(() => {
      fetchProductsAPI()
    }, 2000)

    return () => clearInterval(intervalId)
  }, [userId])

  // Guard the filter to prevent applying it to undefined or null values
  const unfinishedTasks = task?.filter(t => !t.finished) || []

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
          "Task đã xóa - TaskTick"
        ]}
      />
      <Headers />
      <div className="container">
        <main role="main" className="pb-3">
          <div>
            <br />
            <h2>Task đã xóa</h2>
            <br />
            <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Quay lại</button>
            <div className='mt-4'>
              <div className='row'>
                {(currentTasks.every(task => task.deleted != true)) ? (
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <p>Bạn chưa có task nào.</p>
                  </div>
                ) : (
                  currentTasks.map((task) => (
                    task.deleted === true && (
                      <div className="col-sm-6 col-lg-4" key={task._id}>
                      <div className="card" style={{marginTop: '16px', width: '100%', height: '450px'}}>
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
                            <a onClick={() => taskRestoration(task._id)} className="btn btn-success">Khôi phục</a>
                            <a onClick={() => deleteTask(task._id)} className="btn btn-danger">Xóa vĩnh viễn</a>
                          </div>
                          <p style={{ paddingBottom: '30px' }}>Ngày xóa: {new Date(task.deletedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    )
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

export default TaskDeleted