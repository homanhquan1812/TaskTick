import React from 'react'
import Heads from '../components/Heads'

const Error = () => {
  return (
    <div>
        <Heads
        additionalStylesheets={[
          "/css/error.css"
        ]}
        additionalTitle={[
          "Lỗi - R2Sshop"
        ]}></Heads>
        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>Oops!</h1>
                </div>
                <h2>404 - Page not found</h2>
                <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                <a href="/">Go To Homepage</a>
            </div>
        </div>
    </div>
  )
}

export default Error