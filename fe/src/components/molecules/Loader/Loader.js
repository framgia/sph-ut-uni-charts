import React from 'react'

import style from './Loader.module.css'

const Loader = ({ width = 80, height = 80, top = 33 }) => {
  return (
    <div className={style.lds_ellipsis} style={{ width, height }}>
      <div style={{ top }}></div>
      <div style={{ top }}></div>
      <div style={{ top }}></div>
      <div style={{ top }}></div>
    </div>
  )
}

export default Loader
