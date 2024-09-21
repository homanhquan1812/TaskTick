import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phonenumber, setPhoneNumber] = useState('')
  const [registerError, setRegisterError] = useState(false)
  const [registerErrorMessage, setRegisterErrorMessage] = useState('')
  const [registerSuccessful, setRegisterSuccessful] = useState(false)
  const navigateTo = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_WEB_SERVICE}/register`, {
        username, password, name, phonenumber, email
      })
  
      setRegisterError(false)
      setRegisterSuccessful(true)
      
      setTimeout(() => {
        navigateTo('/login')
      }, 3000) // 3 seconds
  
    } catch (error) {
      setRegisterError(true)
      setRegisterSuccessful(false)
  
      if (error.response) {
        const { status, data } = error.response
  
        if (status === 401) {
          switch (data.message) {
            case "This email address already exists.":
              setRegisterErrorMessage('Email này đã tồn tại, vui lòng chọn email khác.')
              break
            case "This phone number already exists.":
              setRegisterErrorMessage('Số điện thoại này đã tồn tại, vui lòng chọn số khác.')
              break
            case "This username already exists.":
              setRegisterErrorMessage('Tên tài khoản này đã tồn tại, vui lòng chọn tên khác.')
              break
            default:
              setRegisterErrorMessage(data.message || 'Đã xảy ra lỗi trong quá trình đăng ký.')
          }
        } else {
          setRegisterErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.')
        }
      } else if (error.request) {
        setRegisterErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
      } else {
        setRegisterErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại.')
      }
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
        "Đăng ký tài khoản - TaskTick"
      ]}></Heads>
      <Headers></Headers>
      <div class="container">
            <main role="main" class="pb-3">
            <div>
              <br />
              <h2>Đăng ký tài khoản</h2>
              <br></br>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">Tên đầy đủ</label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">Email</label>
                  <div className="col-sm-6">
                    <input type="email" className="form-control" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">Số điện thoại</label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="phonenumber" id="phonenumber" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">Tài khoản</label>
                  <div className="col-sm-6">
                    <input type="text" className="form-control" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-3 col-form-label">Mật khẩu</label>
                  <div className="col-sm-6">
                    <input type="password" className="form-control" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                {
                  registerSuccessful && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <strong>Tạo tài khoản thành công. Đang điều hướng đến trang đăng nhập!</strong>
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                    </div>
                  )
                }
                {
                  registerError && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                      <strong>{registerErrorMessage}</strong>
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
                    </div>
                  )
                }
                <div className="row mb-3">
                  <div className="offset-sm-3 col-sm-3 d-grid">
                    <button type="submit" className="btn btn-primary">Đăng ký</button>
                  </div>
                  <div className="col-sm-3 d-grid">
                    <a className="btn btn-outline-primary" href="/" role="button">Hủy</a>
                  </div>
                </div>
              </form>
            </div>
            </main>
        </div>
        <Footers></Footers>
    </div>
  )
}

export default Register