import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import axios from 'axios'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const Info = () => {
  const [username, setUsername] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [name, setName] = useState('')
  const [phonenumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [changeFailed, setChangeFailed] = useState(false)
  const [changeSuccessful, setChangeSuccessful] = useState(false)
  const navigateTo = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    
    try {
      // const response = await axios.put(`https://tasktick-0j1f.onrender.com/${import.meta.env.VITE_APP_API_KEY}/info`, {
      const response = await axios.put(`https://tasktick-0j1f.onrender.com/updateinfo/info`, {
        name, phonenumber, email, username
      }, { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        const decodedToken = jwtDecode(response.data.token)
        setUserId(decodedToken._id)
        setName(decodedToken.name)
        setPhoneNumber(decodedToken.phonenumber)
        setEmail(decodedToken.email)
        setUsername(decodedToken.username)
      }
      
      if (newPassword != '') {
        // await axios.put(`https://tasktick-0j1f.onrender.com/${import.meta.env.VITE_APP_API_KEY}/password`, {
        await axios.put(`https://tasktick-0j1f.onrender.com/updateinfo/password`, {
          oldPassword,
          newPassword
        }, { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        })
      }

      setChangeSuccessful(true)
      setChangeFailed(false)
        
      setTimeout(() => {
        navigateTo(`/home`);
      }, 3000); // 3 seconds
      
    } catch (error) {
      setChangeSuccessful(false)
      setChangeFailed(true)
      console.error("Error: ", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const decodedToken = jwtDecode(token)

      setUserId(decodedToken._id)
      setName(decodedToken.name)
      setPhoneNumber(decodedToken.phonenumber)
      setEmail(decodedToken.email)
      setUsername(decodedToken.username)
    }
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
        "Thông tin cá nhân - R2Sshop"
      ]}/>
      <Headers />
      <div className="container">
        <main role="main" className="pb-3">
          <div>
            <br />
            <h2>Chỉnh sửa thông tin cá nhân:</h2>
            <br></br>
            <form onSubmit={submit}>
            <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Tên đầy đủ</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-6">
                  <input type="email" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Số điện thoại</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" name="phonenumber" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Tài khoản</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control" name="username" value={username} disabled/>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Mật khẩu cũ</label>
                <div className="col-sm-6">
                  <input type="password" className="form-control" name="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Mật khẩu mới</label>
                <div className="col-sm-6">
                  <input type="password" className="form-control" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
                {
                  changeSuccessful && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <strong>Thay đổi thành công. Đang điều hướng đến trang chủ!</strong>
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                    </div>
                  )
                }
                {
                  changeFailed && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                      <strong>Mật khẩu cũ không đúng.</strong>
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                    </div>
                  )
                }
              <div className="row mb-3">
                <div className="offset-sm-3 col-sm-3 d-grid">
                  <button type="submit" className="btn btn-primary">Cập nhật ngay</button>
                </div>
                <div className="col-sm-3 d-grid">
                  <a className="btn btn-outline-primary" href="/courses" role="button">Thoát</a>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footers />
    </div>
  )
}

export default Info