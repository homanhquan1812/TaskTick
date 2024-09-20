import React, { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const AddTask = () => {
  const [title, setTitle] = useState('')
  const [userId, setUserId] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://tasktick-0j1f.onrender.com/task', {
        title, description, photo, userId
      })

      if (response.status == 201) {
        console.log('Added a new course successfully!')
        navigate('/dailytask')
      }
    } catch (error) {
      console.error("Error adding a new course:", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const decodedToken = jwtDecode(token)

      setUserId(decodedToken._id)
    }
  }, [userId])

  return (
    <div>
      <Heads additionalStylesheets={[
        "/css/bootstrap.min.css",
        "/css/site.css",
        "/css/style.css"
      ]}
      additionalTitle={[
        "Thêm task mới - R2Sshop"
      ]}/>
      <Headers />
      <div className="container">
        <main role="main" className="pb-3">
          <br />
          <h2>Thêm task mới</h2>
          <br />
          <form method="POST" onSubmit={submit}>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Tiêu đề</label>
              <div className="col-sm-6">
                <input placeholder='Study about Duolingo' type="text" className="form-control" name="name" id="name" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Mô tả chi tiết</label>
              <div className="col-sm-6">
                <textarea 
                  placeholder='Once upon a time in the digital age, when the world was more interconnected than ever but still divided by languages, a young owl named Duo set out on a mission. '
                  className="form-control" 
                  name="description" 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows="5"
                  cols="50"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Link ảnh minh họa</label>
              <div className="col-sm-6">
                <input placeholder='https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_1_28_638420491606891918_cach-tai-duolingo-tren-may-tinh.jpg' type="text" className="form-control" name="photo" id="photo" value={photo} onChange={(e) => setPhoto(e.target.value)} />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Task của bạn sẽ như thế này</label>
              <div className="col-sm-6">
                <img style={{ display: 'flex', margin: '0 auto', height: '400px'}} src='/img/image3.png'></img>
              </div>
            </div>
            <div className="row mb-3">
              <div className="offset-sm-3 col-sm-3 d-grid">
                <button type="submit" className="btn btn-primary">Tạo ngay</button>
              </div>
              <div className="col-sm-3 d-grid">
                <a className="btn btn-outline-primary" href="/dailytask" role="button">Thoát</a>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Footers />
    </div>
  )
}

export default AddTask