import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const EditTask = () => {
  const { id } = useParams()
  const [taskData, setTaskData] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const navigateTo = useNavigate()

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/task/detail/${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch data!')
        }
        
        const data = await response.json()
        setTaskData(data.task)
        setTitle(data.task.title || '')
        setDescription(data.task.description || '')
        setPhoto(data.task.photo || '')
      } catch (error) {
        console.error("Error: ", error)
        navigateTo('/error')
      }
    }

    fetchTaskData()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5000/task/edit/${id}`, {
        title, description, photo
      })
      if (response.status === 200) {
        console.log('Updated task successfully!', response.data)
        navigateTo('/dailytask')
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }
  
  return (
    <div>
      <Heads
      additionalStylesheets={[
        "/css/bootstrap.min.css",
        "/css/site.css",
        "/css/style.css"
      ]}
      additionalTitle={[
        "Chỉnh sửa khóa học - R2Sshop"
      ]} />
      <Headers />
      <div className="container">
        <main role="main" className="pb-3">
          <div>
            <br />
            <h2>Chỉnh sửa khóa học:</h2>
            <br></br>
            {
              taskData && (
                <div>
                  <form onSubmit={submit}>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Tiêu đề</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" name="name" defaultValue={taskData.title} onChange={(e) => setTitle(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Mô tả</label>
                <div className="col-sm-6">
                  <textarea 
                    className="form-control" 
                    name="description" 
                    id="description" 
                    value={description} 
                    defaultValue={taskData.description} onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    cols="50"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Link ảnh minh họa</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" name="photo" defaultValue={taskData.photo} onChange={(e) => setPhoto(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="offset-sm-3 col-sm-3 d-grid">
                  <button type="submit" className="btn btn-primary">Cập nhật ngay</button>
                </div>
                <div className="col-sm-3 d-grid">
                  <a className="btn btn-outline-primary" href="/dailytask" role="button">Thoát</a>
                </div>
              </div>
            </form>
                </div>
              )
            }
          </div>
        </main>
      </div>
      <Footers />
    </div>
  )
}

export default EditTask
