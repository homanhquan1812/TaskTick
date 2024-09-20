import React, { useEffect, useState } from 'react'
import Heads from '../components/Heads'
import Headers from '../components/Headers'
import Footers from '../components/Footers'
import { useNavigate } from 'react-router-dom'

const Success = () => {
  const navigateTo = useNavigate()

  const coursesDirect = () => {
    navigateTo('/courses')
  }

  const homeDirect = () => {
    navigateTo('/home')
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
        "Thành công - R2Sshop"
      ]}></Heads>
        <Headers></Headers>
      <div className="success_detail">
          <h2>Đăng ký khóa học thành công!</h2>
          <i className="fa-solid fa-check" />
          <h3>R2Sshop sẽ liên hệ lại với bạn để tư vấn và xác nhận.</h3>
          <h3>Xin vui lòng giữ liên lạc!</h3>
      </div>
      <div className="success_button">
          <button className="button-pink " onClick={coursesDirect}>Đăng ký tiếp</button>
          <button className="button-pink " onClick={homeDirect}>Quay lại trang chủ</button>
      </div>
      <Footers></Footers>
        <a href="#" className="backtotop cd-top text-replace js-cd-top">
            <i className="fa fa-angle-up" />
        </a>
    </div>
  )
}

export default Success