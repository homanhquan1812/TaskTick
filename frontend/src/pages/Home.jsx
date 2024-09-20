import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'

const Home = () => {
  const [user, setUser] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const styles = {
    title: {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '700', // Bold
      color: 'rgb(243,189,80)',
      fontSize: '30px',
    },
    subtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: '700', // Regular
      color: '#000',
      fontSize: '25px',
    },
  };

  const submit1 = () => {
    navigate('/dailytask')
  }

  const submit2 = () => {
    navigate('/login')
  }

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          setUser(decodedToken)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Invalid token:', error)
        }
      }
      else {
        setIsLoggedIn(false)
      }
    }

    checkToken()

    const intervalId = setInterval(checkToken, 1000) // Check every second

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
        "Trang chủ - R2Sshop"
      ]}></Heads>
      <Headers></Headers>
      <div className="text-center">
        <h1 className="display-4" style={styles.title}>Lưu trữ mục tiêu hằng ngày của bạn mọi lúc, mọi nơi
        </h1>
        <p style={styles.subtitle}>Giúp bạn đạt được nhiều thành công ^^</p>
        <img style={{height: '400px'}}src='/img/image.png'></img>
        <br></br>
        <br></br>
        {
          isLoggedIn ? (
            <button onClick={submit1} type="button" class="btn btn-warning">Tạo task ngay</button>
          ) : (
            <button onClick={submit2} type="button" class="btn btn-warning">Tạo task ngay</button>
          )
        }
      </div>
      <Footers></Footers>
    </div>
  )
}

export default Home