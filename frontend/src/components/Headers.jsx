import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jwtDecode from "jwt-decode"

const Headers = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState([])

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
        // Token information
        const token = localStorage.getItem('token')

        if (token) {
            const decodedToken = jwtDecode(token)

            setUserId(decodedToken._id)
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

        checkLoginStatus()
        const intervalId = setInterval(checkLoginStatus, 1000) // Check every second

        return () => clearInterval(intervalId)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
    }

  return (
    <div>
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link className="navbar-brand" to="/"><img style={{height: '47.5px'}} src='/img/image2.png' alt="Logo"></img></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/">Trang chủ</Link>
                            </li>     
                            {
                                isLoggedIn ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to='/dailytask'>Task hằng ngày</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to={`/info/${userId}`}>Thông tin cá nhân</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" onClick={handleLogout} to="/">Đăng xuất</Link>
                                        </li> 
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to='/login'>Đăng nhập</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link text-dark" to='/register'>Đăng ký</Link>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default Headers